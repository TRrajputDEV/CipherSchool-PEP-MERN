import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getComments, addComment, updateComment, deleteComment } from "../api/api";

const timeAgo = (date) => {
  const diff = (Date.now() - new Date(date)) / 1000;
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const CommentModal = ({ confession, onClose }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Edit State
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  useEffect(() => {
    if (!confession) return;
    const fetchComments = async () => {
      setLoading(true);
      try {
        const res = await getComments(confession._id);
        setComments(res.data.comments || []);
      } catch (err) { console.error("Failed to load case notes:", err); } 
      finally { setLoading(false); }
    };
    fetchComments();
  }, [confession]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      const res = await addComment(confession._id, { text: newComment });
      setComments((prev) => [res.data.comment, ...prev]);
      setNewComment("");
    } catch (err) { console.error("Failed to attach note:", err); } 
    finally { setSubmitting(false); }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm("Redact this note from the record?")) return;
    try {
      await deleteComment(confession._id, commentId);
      setComments((prev) => prev.filter(c => c._id !== commentId));
    } catch (err) { console.error("Failed to redact note:", err); }
  };

  const handleEditSubmit = async (commentId) => {
    if (!editText.trim()) return;
    try {
      await updateComment(confession._id, commentId, { text: editText });
      setComments((prev) => prev.map(c => c._id === commentId ? { ...c, text: editText } : c));
      setEditingId(null);
    } catch (err) { console.error("Failed to amend note:", err); }
  };

  if (!confession) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-[#030303]/90 backdrop-blur-md transition-opacity duration-500" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 shadow-2xl anim-scale-in flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-white/5 shrink-0">
          <span className="text-[#888] text-[10px] tracking-[0.3em] font-mono uppercase">
            Evidence File #{confession._id.slice(-6)}
          </span>
          <button onClick={onClose} className="text-[#555] hover:text-white transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Content Area */}
        <div className="overflow-y-auto flex-1 p-8 custom-scrollbar">
          <div className="mb-10 relative">
            <div className="absolute -left-4 top-0 bottom-0 w-[2px] bg-white/10" />
            <p className="text-white text-xl sm:text-2xl leading-relaxed font-light whitespace-pre-wrap italic" style={{ fontFamily: 'var(--font-serif)' }}>
              "{confession.text}"
            </p>
          </div>

          <div className="border-t border-dashed border-white/10 pt-8">
            <h3 className="text-[#555] text-[10px] tracking-[0.3em] font-mono uppercase mb-6">
              Field Notes ({comments.length})
            </h3>

            {loading ? (
              <div className="flex justify-center py-8"><div className="spinner border-white/20 border-t-white" /></div>
            ) : comments.length === 0 ? (
              <p className="text-[#555] font-mono text-xs italic">No notes attached to this file yet.</p>
            ) : (
              <div className="space-y-6">
                {comments.map((comment) => {
                  const isOwner = user?.googleId === comment.userId;
                  const isEditing = editingId === comment._id;

                  return (
                    <div key={comment._id} className="bg-[#111] border border-white/5 p-4 relative group transition-all">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-white text-[10px] font-bold font-mono tracking-widest uppercase flex items-center gap-2">
                          {comment.user?.displayName || "Agent"}
                          {isOwner && <span className="text-[#ff9900] opacity-70 text-[8px]">(You)</span>}
                        </span>
                        
                        <div className="flex items-center gap-3">
                          <span className="text-[#555] text-[9px] uppercase tracking-widest font-mono">
                            {timeAgo(comment.createdAt)}
                          </span>
                          
                          {/* Owner Actions */}
                          {isOwner && !isEditing && (
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => { setEditingId(comment._id); setEditText(comment.text); }} className="text-[#555] hover:text-white text-[9px] uppercase font-mono tracking-widest">Amend</button>
                              <button onClick={() => handleDelete(comment._id)} className="text-[#555] hover:text-[#ff4444] text-[9px] uppercase font-mono tracking-widest">Redact</button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Text or Edit Mode */}
                      {isEditing ? (
                        <div className="flex flex-col gap-2">
                          <textarea 
                            value={editText} 
                            onChange={(e) => setEditText(e.target.value)} 
                            className="bg-black/50 border border-white/20 text-[#ccc] p-2 text-sm font-light w-full outline-none resize-none"
                            rows="3"
                          />
                          <div className="flex gap-2 justify-end mt-1">
                            <button onClick={() => setEditingId(null)} className="text-[#888] hover:text-white text-[10px] uppercase tracking-widest font-mono">Cancel</button>
                            <button onClick={() => handleEditSubmit(comment._id)} className="text-black bg-white px-3 py-1 text-[10px] uppercase tracking-widest font-mono font-bold hover:bg-[#ccc]">Save</button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-[#ccc] text-sm font-light leading-relaxed whitespace-pre-wrap" style={{ fontFamily: 'var(--font-sans)' }}>
                          {comment.text}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer Input */}
        <div className="p-6 border-t border-white/5 shrink-0 bg-[#080808]">
          {user ? (
            <form onSubmit={handleSubmit} className="flex gap-4">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a field note..."
                className="flex-1 bg-transparent border-b border-white/10 text-white placeholder-[#555] px-2 py-2 outline-none focus:border-white transition-colors text-sm font-light"
              />
              <button
                type="submit"
                disabled={submitting || !newComment.trim()}
                className="bg-white text-black text-[10px] font-bold tracking-widest uppercase px-6 py-3 hover:bg-[#e0e0e0] transition-colors disabled:opacity-50"
              >
                {submitting ? 'Appending...' : 'Attach'}
              </button>
            </form>
          ) : (
            <div className="text-center text-[#555] text-[10px] font-mono uppercase tracking-widest py-3 border border-dashed border-white/10">
              Authentication required to attach notes.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default CommentModal;