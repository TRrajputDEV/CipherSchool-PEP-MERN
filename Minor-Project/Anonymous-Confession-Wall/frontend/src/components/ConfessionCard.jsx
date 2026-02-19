// import { useState } from "react";
// import { reactConfession, updateConfession, deleteConfession } from "../api/api";

// const REACTIONS = [
//   { type: "like", label: "Like", icon: (
//     <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/>
//       <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
//     </svg>
//   )},
//   { type: "love", label: "Love", icon: (
//     <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
//     </svg>
//   )},
//   { type: "laugh", label: "Laugh", icon: (
//     <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <circle cx="12" cy="12" r="10"/>
//       <path d="M8 13s1.5 2 4 2 4-2 4-2"/>
//       <line x1="9" y1="9" x2="9.01" y2="9"/>
//       <line x1="15" y1="9" x2="15.01" y2="9"/>
//     </svg>
//   )},
// ];

// const timeAgo = (date) => {
//   const diff = (Date.now() - new Date(date)) / 1000;
//   if (diff < 60) return "just now";
//   if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
//   if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
//   if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
//   return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
// };

// const SecretInput = ({ value, onChange, placeholder }) => (
//   <div className="relative">
//     <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--muted-2)" strokeWidth="2">
//       <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
//       <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
//     </svg>
//     <input
//       type="password"
//       autoComplete="off"
//       value={value}
//       onChange={onChange}
//       placeholder={placeholder || "Secret code"}
//       className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] placeholder-[var(--muted-2)] text-xs pl-9 pr-4 py-2.5 outline-none focus:border-[var(--border-2)] transition-colors font-light"
//     />
//   </div>
// );

// const ActionButtons = ({ onCancel, confirmLabel, confirmClass, loading }) => (
//   <div className="flex gap-2 justify-end">
//     <button
//       type="button"
//       onClick={onCancel}
//       className="text-xs text-[var(--muted)] border border-[var(--border)] px-4 py-2 rounded-lg hover:border-[var(--border-2)] hover:text-[var(--text)] transition-all active:scale-95"
//     >
//       Cancel
//     </button>
//     <button
//       type="submit"
//       disabled={loading}
//       className={`text-xs font-medium px-4 py-2 rounded-lg transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 ${confirmClass}`}
//     >
//       {loading && <span className="spinner spinner-sm" />}
//       {confirmLabel}
//     </button>
//   </div>
// );

// const ConfessionCard = ({ confession, onUpdated, onDeleted, isAuthenticated }) => {
//   const [data, setData] = useState(confession);
//   const [mode, setMode] = useState("view");
//   const [editText, setEditText] = useState(confession.text);
//   const [secretCode, setSecretCode] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [voted, setVoted] = useState(new Set(confession.userReactions || []));
//   const [animating, setAnimating] = useState(null);

//   const handleReact = async (type) => {
//     try {
//       const res = await reactConfession(data._id, type);
//       setData(res.data);
//       setVoted(new Set(res.data.userReactions || []));
//       setAnimating(type);
//       setTimeout(() => setAnimating(null), 350);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleEdit = async (e) => {
//     e.preventDefault();
//     setError("");
//     if (!secretCode) return setError("Enter your secret code.");
//     setLoading(true);
//     try {
//       const res = await updateConfession(data._id, { text: editText, secretCode });
//       setData(res.data);
//       onUpdated(res.data);
//       resetForm();
//     } catch (err) {
//       setError(err.response?.data?.message || "Update failed.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (e) => {
//     e.preventDefault();
//     setError("");
//     if (!secretCode) return setError("Enter your secret code.");
//     setLoading(true);
//     try {
//       await deleteConfession(data._id, secretCode);
//       onDeleted(data._id);
//     } catch (err) {
//       setError(err.response?.data?.message || "Delete failed.");
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setMode("view");
//     setSecretCode("");
//     setError("");
//     setEditText(data.text);
//   };

//   const totalReactions = data.reactions.like + data.reactions.love + data.reactions.laugh;

//   return (
//     <article className="
//       group
//       bg-[var(--surface)]
//       border border-[var(--border)]
//       shadow-xl
//       hover:shadow-2xl
//       hover:-translate-y-[2px]
//       transition-all duration-200
//       rounded-2xl p-5 flex flex-col gap-3.5
//     ">

//       <div className="flex items-center justify-between">
//         <span className="text-[11px] text-[var(--muted)]">Anonymous</span>
//         <time className="text-[11px] text-[var(--muted-2)]">{timeAgo(data.createdAt)}</time>
//       </div>

//       {mode === "view" && (
//         <>
//           <p className="text-sm text-[var(--text)] leading-relaxed font-light">
//             {data.text}
//           </p>

//           <div className="flex items-center justify-between flex-wrap pt-1">

//             <div className="flex items-center gap-1.5">
//               {REACTIONS.map(({ type, icon }) => {
//                 const hasVoted = voted.has(type);
//                 const isAnimating = animating === type;

//                 return (
//                   <button
//                     key={type}
//                     onClick={() => isAuthenticated && handleReact(type)}
//                     className={`
//                       flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-full border
//                       transition-all duration-150
//                       ${!isAuthenticated ? "opacity-50 cursor-default" : "active:scale-95"}
//                       ${hasVoted
//                         ? "border-[var(--accent)] text-[var(--accent)] bg-[rgba(255,60,60,0.08)] shadow-[0_0_8px_rgba(255,60,60,0.35)]"
//                         : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--border-2)] hover:text-[var(--text)]"
//                       }
//                       ${isAnimating ? "reaction-pop" : ""}
//                     `}
//                   >
//                     {icon}
//                     <span>{data.reactions[type]}</span>
//                   </button>
//                 );
//               })}
//               {totalReactions > 0 && (
//                 <span className="text-[10px] text-[var(--muted-2)] ml-1">
//                   {totalReactions}
//                 </span>
//               )}
//             </div>

//             {isAuthenticated && (
//               <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                 <button onClick={() => setMode("edit")} className="text-xs text-[var(--muted)] hover:text-[var(--text)] px-2 py-1">
//                   Edit
//                 </button>
//                 <button onClick={() => setMode("delete")} className="text-xs text-[var(--muted)] hover:text-[var(--accent)] px-2 py-1">
//                   Delete
//                 </button>
//               </div>
//             )}
//           </div>
//         </>
//       )}

//       {mode === "edit" && (
//         <form onSubmit={handleEdit} className="flex flex-col gap-3 anim-slide-down">
//           <textarea
//             rows={3}
//             value={editText}
//             onChange={(e) => setEditText(e.target.value)}
//             className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl text-[var(--text)] text-sm px-4 py-3 resize-none outline-none focus:border-[var(--border-2)]"
//           />
//           <SecretInput
//             value={secretCode}
//             onChange={(e) => setSecretCode(e.target.value)}
//             placeholder="Enter secret code to save"
//           />
//           {error && <p className="text-xs text-[var(--accent)]">{error}</p>}
//           <ActionButtons
//             onCancel={resetForm}
//             confirmLabel="Save changes"
//             confirmClass="bg-[var(--text)] text-black hover:bg-white"
//             loading={loading}
//           />
//         </form>
//       )}

//       {mode === "delete" && (
//         <form onSubmit={handleDelete} className="flex flex-col gap-3 anim-slide-down">
//           <p className="text-xs text-[var(--muted)] border border-[var(--border)] rounded-lg px-3 py-2 bg-[var(--bg)]">
//             This will permanently remove your confession.
//           </p>
//           <SecretInput
//             value={secretCode}
//             onChange={(e) => setSecretCode(e.target.value)}
//             placeholder="Enter secret code to delete"
//           />
//           {error && <p className="text-xs text-[var(--accent)]">{error}</p>}
//           <ActionButtons
//             onCancel={resetForm}
//             confirmLabel="Delete"
//             confirmClass="bg-[var(--accent)] text-white hover:bg-[var(--accent-d)]"
//             loading={loading}
//           />
//         </form>
//       )}
//     </article>
//   );
// };

// export default ConfessionCard;




import { useState } from "react";
import { reactConfession, updateConfession, deleteConfession } from "../api/api";

const REACTIONS = [
  { type: "like",  label: "Like",  icon: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/>
      <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
    </svg>
  )},
  { type: "love",  label: "Love",  icon: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  )},
  { type: "laugh", label: "Laugh", icon: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M8 13s1.5 2 4 2 4-2 4-2"/>
      <line x1="9" y1="9" x2="9.01" y2="9"/>
      <line x1="15" y1="9" x2="15.01" y2="9"/>
    </svg>
  )},
];

const timeAgo = (date) => {
  const diff = (Date.now() - new Date(date)) / 1000;
  if (diff < 60)    return "just now";
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const SecretInput = ({ value, onChange, placeholder }) => (
  <div className="relative">
    <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6e6c6a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
    <input
      type="password"
      autoComplete="off"
      value={value}
      onChange={onChange}
      placeholder={placeholder || "Secret code"}
      className="w-full bg-[#0d0d0d] border border-[#1e1e1e] rounded-lg text-[#eeebe6] placeholder-[#555250] text-xs pl-9 pr-4 py-2.5 outline-none focus:border-[#2a2a2a] transition-colors font-light"
    />
  </div>
);

const ActionButtons = ({ onCancel, onConfirm, confirmLabel, confirmClass, loading }) => (
  <div className="flex gap-2 justify-end">
    <button
      type="button"
      onClick={onCancel}
      className="text-xs text-[#5a5856] border border-[#1e1e1e] px-4 py-2 rounded-lg hover:border-[#2a2a2a] hover:text-[#eeebe6] transition-all duration-150 active:scale-95"
    >
      Cancel
    </button>
    <button
      type="submit"
      disabled={loading}
      className={`text-xs font-medium px-4 py-2 rounded-lg transition-all duration-150 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 ${confirmClass}`}
    >
      {loading && <span className="spinner spinner-sm" />}
      {confirmLabel}
    </button>
  </div>
);

const ConfessionCard = ({ confession, onUpdated, onDeleted, isAuthenticated }) => {
  const [data, setData]         = useState(confession || {});
  const [mode, setMode]         = useState("view");
  const [editText, setEditText] = useState(confession?.text || "");
  const [secretCode, setSecretCode] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const [voted, setVoted] = useState(
    new Set(confession?.userReactions || [])
  );
  const [animating, setAnimating] = useState(null);

  // Guard — render nothing if confession is missing (keeps hooks order safe)
  if (!confession?._id) return null;

  // ── React (toggle) ─────────────────────────────────────────
  const handleReact = async (type) => {
    try {
      const res = await reactConfession(data._id, type);
      // Server returns updated counts + which types this user has reacted to
      setData(res.data);
      setVoted(new Set(res.data.userReactions || []));
      setAnimating(type);
      setTimeout(() => setAnimating(null), 350);
    } catch (err) {
      console.error("Reaction failed:", err);
    }
  };

  // ── Edit ───────────────────────────────────────────────────
  const handleEdit = async (e) => {
    e.preventDefault();
    setError("");
    if (!secretCode) return setError("Enter your secret code.");
    setLoading(true);
    try {
      const res = await updateConfession(data._id, { text: editText, secretCode });
      setData(res.data);
      onUpdated(res.data);
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || "Update failed.");
    } finally {
      setLoading(false);
    }
  };

  // ── Delete ─────────────────────────────────────────────────
  const handleDelete = async (e) => {
    e.preventDefault();
    setError("");
    if (!secretCode) return setError("Enter your secret code.");
    setLoading(true);
    try {
      await deleteConfession(data._id, secretCode);
      onDeleted(data._id);
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed.");
      setLoading(false);
    }
  };

  const resetForm = () => {
    setMode("view");
    setSecretCode("");
    setError("");
    setEditText(data.text);
  };

  const totalReactions = data.reactions.like + data.reactions.love + data.reactions.laugh;

  return (
    <article className="group bg-[#141414] border border-[#1a1a1a] rounded-2xl p-5 flex flex-col gap-3.5 transition-all duration-200 hover:border-[#242424]">

      {/* Top row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Anon avatar placeholder */}
          <div className="w-6 h-6 rounded-full bg-[#1e1e1e] border border-[#242424] flex items-center justify-center shrink-0">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#6e6c6a" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <span className="text-[11px] text-[#6e6c6a] tracking-wide font-light">Anonymous</span>
        </div>
        <time className="text-[11px] text-[#555250] tabular-nums">{timeAgo(data.createdAt)}</time>
      </div>

      {/* ── VIEW ───────────────────────────────────────────── */}
      {mode === "view" && (
        <>
          <p className="text-sm text-[#d8d5d0] leading-relaxed font-light">{data.text}</p>

          {/* Tags */}
          {data.tags && data.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {data.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] text-[#8a8784] bg-[#1a1a1a] border border-[#242424] px-2 py-0.5 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Bottom row */}
          <div className="flex items-center justify-between gap-3 flex-wrap pt-0.5">
            {/* Reactions */}
            <div className="flex items-center gap-1.5">
              {REACTIONS.map(({ type, label, icon }) => {
                const hasVoted = voted.has(type);
                const isAnimating = animating === type;
                return (
                  <button
                    key={type}
                    onClick={() => isAuthenticated && handleReact(type)}
                    title={
                      !isAuthenticated
                        ? "Sign in to react"
                        : hasVoted
                          ? `Remove ${label}`
                          : label
                    }
                    className={`
                      flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-full border
                      transition-all duration-150
                      ${!isAuthenticated ? "cursor-default opacity-50" : "cursor-pointer active:scale-95"}
                      ${hasVoted
                        ? "border-[#ff3c3c] text-[#ff3c3c] bg-[rgba(255,60,60,0.08)]"
                        : "border-[#1e1e1e] text-[#5a5856] hover:border-[#2a2a2a] hover:text-[#eeebe6]"
                      }
                      ${isAnimating ? "reaction-pop" : ""}
                    `}
                  >
                    <span className={hasVoted ? "text-[#ff3c3c]" : "text-[#6e6c6a]"}>
                      {icon}
                    </span>
                    <span className="tabular-nums">{data.reactions[type]}</span>
                  </button>
                );
              })}
              {totalReactions > 0 && (
                <span className="text-[10px] text-[#555250] ml-1 tabular-nums">{totalReactions}</span>
              )}
            </div>

            {/* Edit / Delete — only for logged-in users */}
            {isAuthenticated ? (
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={() => { setMode("edit"); setError(""); }}
                  className="text-[11px] text-[#6e6c6a] hover:text-[#eeebe6] px-2.5 py-1.5 rounded-lg hover:bg-[#1a1a1a] transition-all duration-150"
                >
                  Edit
                </button>
                <button
                  onClick={() => { setMode("delete"); setError(""); }}
                  className="text-[11px] text-[#6e6c6a] hover:text-[#ff3c3c] px-2.5 py-1.5 rounded-lg hover:bg-[rgba(255,60,60,0.06)] transition-all duration-150"
                >
                  Delete
                </button>
              </div>
            ) : (
              /* Guest nudge */
              <span className="text-[10px] text-[#2a2a2a] font-light opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Sign in to react
              </span>
            )}
          </div>
        </>
      )}

      {/* ── EDIT ───────────────────────────────────────────── */}
      {mode === "edit" && (
        <form onSubmit={handleEdit} className="flex flex-col gap-3 anim-slide-down">
          <textarea
            rows={3}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full bg-[#0d0d0d] border border-[#1e1e1e] rounded-xl text-[#eeebe6] text-sm px-4 py-3 resize-none outline-none focus:border-[#2a2a2a] transition-colors leading-relaxed font-light"
          />
          <SecretInput
            value={secretCode}
            onChange={(e) => setSecretCode(e.target.value)}
            placeholder="Enter secret code to save"
          />
          {error && (
            <p className="text-xs text-[#ff3c3c] anim-fade-in">{error}</p>
          )}
          <ActionButtons
            onCancel={resetForm}
            confirmLabel="Save changes"
            confirmClass="bg-[#eeebe6] text-[#111] hover:bg-white"
            loading={loading}
          />
        </form>
      )}

      {/* ── DELETE ─────────────────────────────────────────── */}
      {mode === "delete" && (
        <form onSubmit={handleDelete} className="flex flex-col gap-3 anim-slide-down">
          <p className="text-xs text-[#5a5856] leading-relaxed border border-[#1e1e1e] rounded-lg px-3.5 py-2.5 bg-[#0d0d0d]">
            This will permanently remove your confession. Enter your secret code to confirm.
          </p>
          <SecretInput
            value={secretCode}
            onChange={(e) => setSecretCode(e.target.value)}
            placeholder="Enter secret code to delete"
          />
          {error && (
            <p className="text-xs text-[#ff3c3c] anim-fade-in">{error}</p>
          )}
          <ActionButtons
            onCancel={resetForm}
            confirmLabel="Delete"
            confirmClass="bg-[#ff3c3c] text-white hover:bg-[#e53535]"
            loading={loading}
          />
        </form>
      )}
    </article>
  );
};

export default ConfessionCard;