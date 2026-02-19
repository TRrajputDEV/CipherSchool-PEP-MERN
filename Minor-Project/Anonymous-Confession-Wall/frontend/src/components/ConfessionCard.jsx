import { useState } from "react";
import { reactConfession, updateConfession, deleteConfession } from "../api/api";

const REACTIONS = [
  { type: "like",  icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
  )},
  { type: "love",  icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
  )},
  { type: "laugh", icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
  )},
];

const timeAgo = (date) => {
  const diff = (Date.now() - new Date(date)) / 1000;
  if (diff < 60)    return "Just now";
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const getCardPersonality = (id) => {
  if (!id) return { tilt: 0, theme: 'bg-[#111]', tapeStyle: 0, stamp: '' };
  const charCode = id.charCodeAt(id.length - 1) + id.charCodeAt(id.length - 2);
  const themes = ['bg-[#0d0d0d]', 'bg-[#111111]', 'bg-[#141212]', 'bg-[#0f1115]'];
  const theme = themes[charCode % themes.length];
  const tilt = (charCode % 5) - 2; 
  const tapeStyle = charCode % 3;
  const stamps = ['', '', '', 'EVIDENCE', 'ARCHIVED', 'SEALED'];
  const stamp = stamps[charCode % stamps.length];
  return { tilt, theme, tapeStyle, stamp };
};

// ADD onCardClick to props
const ConfessionCard = ({ confession, onUpdated, onDeleted, isAuthenticated, onCardClick }) => {
  const [data, setData]           = useState(confession || {});
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText]   = useState(confession?.text || "");
  const [secretCode, setSecretCode] = useState("");
  const [error, setError]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [voted, setVoted]         = useState(new Set(confession?.userReactions || []));

  if (!confession?._id) return null;

  const { tilt, theme, tapeStyle, stamp } = getCardPersonality(data._id);

  const handleReact = async (type) => {
    try {
      const res = await reactConfession(data._id, type);
      setData(res.data);
      setVoted(new Set(res.data.userReactions || []));
    } catch (err) { console.error(err); }
  };

  const handleEdit = async (e, newStatus = null) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent modal from opening
    if (!secretCode) return setError("Code required.");
    setLoading(true);
    try {
      const payload = { text: editText, secretCode };
      if (newStatus) payload.status = newStatus;

      const res = await updateConfession(data._id, payload);
      setData(res.data);
      onUpdated(res.data);
      setIsEditing(false);
      setError("");
      setSecretCode(""); 
    } catch (err) { setError("Invalid code."); } 
    finally { setLoading(false); }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent modal from opening
    if (!secretCode) return setError("Code required.");
    setLoading(true);
    try {
      await deleteConfession(data._id, secretCode);
      onDeleted(data._id);
    } catch (err) { setError("Invalid code."); setLoading(false); }
  };

  return (
    <article 
      // THE MAIN CLICK HANDLER
      onClick={() => {
        if (!isEditing && onCardClick) onCardClick(data);
      }}
      // Added cursor-pointer
      className="group relative flex flex-col h-full transition-all duration-500 hover:z-20 hover:scale-[1.03] cursor-pointer"
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      
      {/* ── TAPE OVERLAYS ── */}
      {tapeStyle === 0 && <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-7 bg-white/10 backdrop-blur-md rotate-[-2deg] border border-white/5 shadow-md z-20 pointer-events-none" />}
      {tapeStyle === 1 && (
        <>
          <div className="absolute -top-2 -left-2 w-12 h-5 bg-white/10 backdrop-blur-md rotate-[-45deg] shadow-md z-20 pointer-events-none" />
          <div className="absolute -bottom-2 -right-2 w-12 h-5 bg-white/10 backdrop-blur-md rotate-[-45deg] shadow-md z-20 pointer-events-none" />
        </>
      )}
      {tapeStyle === 2 && <div className="absolute -top-2 right-4 w-16 h-6 bg-white/10 backdrop-blur-md rotate-[12deg] shadow-md z-20 pointer-events-none" />}

      {/* ── CARD BODY ── */}
      <div className={`relative ${theme} border border-white/10 p-6 sm:p-8 shadow-[0_12px_35px_rgb(0,0,0,0.9)] flex-1 flex flex-col overflow-hidden`}>
        
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />

        {stamp && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02] select-none overflow-hidden">
            <span className="text-[5rem] font-black tracking-widest text-white -rotate-45" style={{ fontFamily: 'var(--font-sans)' }}>{stamp}</span>
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-center mb-6 relative z-10">
          <span className="text-[10px] text-[#666] uppercase tracking-[0.2em] font-bold">
            Entry #{data._id?.slice(-4) || 'XXXX'}
          </span>
          <div className="flex items-center gap-4">
            {data.status === 'draft' && (
              <span className="text-[#ff9900] border border-[#ff9900]/30 px-1.5 py-0.5 text-[8px] font-mono uppercase tracking-widest">Draft</span>
            )}
            <time className="text-[10px] text-[#555] uppercase tracking-[0.1em]">{timeAgo(data.createdAt)}</time>
            {isAuthenticated && (
              <button 
                // STOP PROPAGATION HERE
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(!isEditing);
                  setError(""); 
                }} 
                className="text-[#444] hover:text-white transition-colors"
              >
                {isEditing ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                ) : (
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/><circle cx="5" cy="12" r="1.5"/></svg>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        {!isEditing ? (
          <>
            <p className="text-[#eee] text-lg sm:text-xl leading-relaxed font-light mb-8 flex-1 whitespace-pre-wrap relative z-10" style={{ fontFamily: 'var(--font-serif)' }}>
              {data.text}
            </p>

            <div className="mt-auto relative z-10">
              {data.tags && data.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {data.tags.map(tag => (
                    <span key={tag} className="text-[9px] text-[#888] border border-white/10 px-2 py-1 uppercase tracking-[0.15em] bg-black/20">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Footer / Reactions */}
              <div className="flex items-center justify-between border-t border-dashed border-white/10 pt-4">
                <div className="flex items-center gap-5">
                  {REACTIONS.map(({ type, icon }) => (
                     <button 
                       key={type}
                       // STOP PROPAGATION HERE
                       onClick={(e) => {
                         e.stopPropagation();
                         if (isAuthenticated) handleReact(type);
                       }}
                       disabled={data.status === 'draft'}
                       className={`flex items-center gap-2 transition-all duration-300 ${data.status === 'draft' ? 'opacity-30 cursor-not-allowed' : ''} ${voted.has(type) ? 'text-white scale-110' : 'text-[#555] hover:text-[#aaa]'}`}
                     >
                       {icon}
                       <span className="text-xs tracking-widest font-sans">{data.reactions[type] || 0}</span>
                     </button>
                  ))}
                </div>
                
                {/* Visual cue that it's clickable */}
                <div className="text-[#333] group-hover:text-white/40 transition-colors flex items-center gap-1">
                   <span className="text-[9px] font-mono tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">Examine</span>
                   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7"/></svg>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* ── EDIT MODE ── */
          <div 
            className="flex flex-col gap-4 flex-1 anim-fade-in relative z-10"
            onClick={(e) => e.stopPropagation()} // STOP CLICKS INSIDE FORM FROM OPENING MODAL
          >
             <textarea 
                value={editText} 
                onChange={e => setEditText(e.target.value)}
                className="bg-black/40 text-[#eee] text-lg font-light leading-relaxed p-4 border border-white/10 outline-none resize-none flex-1 min-h-[120px] focus:border-white/30 transition-colors custom-scrollbar"
                style={{ fontFamily: 'var(--font-serif)' }}
             />
             
             <div className="flex flex-col gap-3 mt-auto pt-4 border-t border-dashed border-white/10">
               <input 
                 type="password" 
                 placeholder="Authorization Code" 
                 value={secretCode}
                 onChange={e => setSecretCode(e.target.value)}
                 className="w-full bg-transparent text-white text-xs tracking-widest px-2 py-2 border-b border-white/10 outline-none focus:border-white transition-colors"
               />
               
               <div className="flex gap-2 w-full pt-2">
                 <button onClick={(e) => handleEdit(e, data.status)} disabled={loading} className="flex-1 bg-white text-black text-[9px] sm:text-[10px] font-bold tracking-widest uppercase px-2 py-2.5 hover:bg-[#e0e0e0] transition-colors disabled:opacity-50">Save</button>
                 <button onClick={(e) => handleEdit(e, data.status === 'draft' ? 'published' : 'draft')} disabled={loading} className="flex-[1.5] bg-transparent border border-white/40 text-white text-[9px] sm:text-[10px] font-bold tracking-widest uppercase px-2 py-2.5 hover:bg-white/10 transition-all disabled:opacity-50">
                   {data.status === 'draft' ? 'Publish' : 'Make Draft'}
                 </button>
                 <button onClick={handleDelete} disabled={loading} className="flex-1 bg-transparent border border-[#ff4444] text-[#ff4444] text-[9px] sm:text-[10px] font-bold tracking-widest uppercase px-2 py-2.5 hover:bg-[#ff4444] hover:text-white transition-all disabled:opacity-50">Burn</button>
               </div>
             </div>
             {error && <p className="text-[#ff4444] text-[10px] tracking-wide mt-1 text-center">{error}</p>}
          </div>
        )}
      </div>
    </article>
  );
};

export default ConfessionCard;