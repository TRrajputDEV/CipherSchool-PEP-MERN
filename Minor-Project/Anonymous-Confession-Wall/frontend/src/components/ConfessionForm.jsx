// import { useState } from "react";
// import { createConfession } from "../api/api";

// const ConfessionForm = ({ onCreated }) => {
//   const [text, setTextState]             = useState("");
//   const [secretCode, setSecretCode] = useState("");
//   const [error, setError]           = useState("");
//   const [loading, setLoading]       = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (!text.trim())          return setError("Confession cannot be empty.");
//     if (secretCode.length < 4) return setError("Secret code must be at least 4 characters.");

//     setLoading(true);
//     try {
//       const res = await createConfession({ text, secretCode });
//       onCreated(res.data);
//       setTextState("");
//       setSecretCode("");
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to post confession.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-5 flex flex-col gap-3"
//     >
//       {/* Label */}
//       <span
//         className="text-sm tracking-[0.15em] text-[#ff3c3c]"
//         style={{ fontFamily: "'Bebas Neue', sans-serif" }}
//       >
//         SHARE ANONYMOUSLY
//       </span>

//       {/* Text area */}
//       <textarea
//         rows={4}
//         maxLength={1000}
//         value={text}
//         onChange={(e) => setTextState(e.target.value)}
//         placeholder="What's on your mind? No one will know it's you..."
//         className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-lg text-[#f0ede8] placeholder-[#6b6866] text-sm px-4 py-3 resize-y outline-none focus:border-[#ff3c3c] transition leading-relaxed"
//       />

//       {/* Bottom row: secret input + submit */}
//       <div className="flex gap-3 flex-wrap">
//         <input
//           type="password"
//           autoComplete="off"
//           value={secretCode}
//           onChange={(e) => setSecretCode(e.target.value)}
//           placeholder="🔑 Secret code (min 4 chars)"
//           className="flex-1 min-w-[180px] bg-[#1e1e1e] border border-[#2a2a2a] rounded-lg text-[#f0ede8] placeholder-[#6b6866] text-sm px-4 py-3 outline-none focus:border-[#ff3c3c] transition"
//         />
//         <button
//           type="submit"
//           disabled={loading}
//           className="bg-[#ff3c3c] text-white text-base px-6 py-3 rounded-lg hover:opacity-85 hover:-translate-y-0.5 active:translate-y-0 transition disabled:opacity-40 disabled:cursor-not-allowed"
//           style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.08em" }}
//         >
//           {loading ? "Posting..." : "CONFESS"}
//         </button>
//       </div>

//       {/* Error */}
//       {error && (
//         <p className="text-sm text-[#ff3c3c] bg-[rgba(255,60,60,0.08)] border border-[rgba(255,60,60,0.2)] px-3 py-2 rounded-lg">
//           {error}
//         </p>
//       )}

//       {/* Hint */}
//       <p className="text-xs text-[#cfcfcf] leading-relaxed">
//         💡 Remember your secret code — you'll need it to edit or delete this confession.
//       </p>
//     </form>
//   );
// };

// export default ConfessionForm;



import { useState } from "react";
import { createConfession } from "../api/api";
import TagSelector from "./TagSelector";

const ConfessionForm = ({ onCreated }) => {
  const [text, setText]             = useState("");
  const [secretCode, setSecretCode] = useState("");
  const [tags, setTags]             = useState([]);
  const [error, setError]           = useState("");
  const [loading, setLoading]       = useState(false);
  const [success, setSuccess]       = useState(false);

  const charLimit = 600;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!text.trim())          return setError("Confession cannot be empty.");
    if (secretCode.length < 4) return setError("Secret code must be at least 4 characters.");
    setLoading(true);
    try {
      const res = await createConfession({ text, secretCode, tags });
      onCreated(res.data);
      setText("");
      setSecretCode("");
      setTags([]);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2200);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post confession.");
    } finally {
      setLoading(false);
    }
  };

  const remaining  = charLimit - text.length;
  const isNearLimit = remaining < 80;

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-5 sm:p-6 flex flex-col gap-4"
    >
      {/* Header row */}
      <div className="flex items-center justify-between">
        <span
          className="text-[0.68rem] tracking-[0.22em] text-[#ff3c3c]"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          NEW CONFESSION
        </span>
        {success && (
          <span className="text-[0.68rem] tracking-wider text-[#22c55e] anim-fade-in font-medium">
            Posted successfully
          </span>
        )}
      </div>

      {/* Textarea */}
      <div className="relative">
        <textarea
          rows={4}
          maxLength={charLimit}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's on your mind? No one will know it's you..."
          className="w-full bg-[#0d0d0d] border border-[#1e1e1e] rounded-xl text-[#eeebe6] placeholder-[#555250] text-sm px-4 py-3.5 resize-none outline-none transition-colors duration-200 focus:border-[#2a2a2a] leading-relaxed font-light"
        />
        {text.length > 0 && (
          <span className={`absolute bottom-3 right-3.5 text-[11px] tabular-nums transition-colors duration-150 ${isNearLimit ? "text-[#ff3c3c]" : "text-[#555250]"}`}>
            {remaining}
          </span>
        )}
      </div>

      {/* Tags */}
      <TagSelector value={tags} onChange={setTags} />

      {/* Bottom row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Secret code */}
        <div className="relative flex-1">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6e6c6a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4"/>
          </svg>
          <input
            type="password"
            autoComplete="off"
            value={secretCode}
            onChange={(e) => setSecretCode(e.target.value)}
            placeholder="Secret code  (min 4 chars)"
            className="w-full bg-[#0d0d0d] border border-[#1e1e1e] rounded-xl text-[#eeebe6] placeholder-[#555250] text-sm pl-9 pr-4 py-3.5 outline-none transition-colors duration-200 focus:border-[#2a2a2a] font-light"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-[#ff3c3c] text-white px-7 py-3.5 rounded-xl shrink-0 transition-all duration-150 hover:bg-[#e53535] hover:shadow-[0_0_28px_rgba(255,60,60,0.22)] active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.1em", fontSize: "1.05rem" }}
        >
          {loading && <span className="spinner spinner-sm" />}
          {loading ? "POSTING" : "CONFESS"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs text-[#ff3c3c] bg-[rgba(255,60,60,0.05)] border border-[rgba(255,60,60,0.1)] px-4 py-2.5 rounded-lg anim-slide-down">
          {error}
        </p>
      )}

      {/* Hint */}
      <p className="text-[11px] text-[#555250] leading-relaxed">
        Remember your secret code — you will need it to edit or delete this confession.
      </p>
    </form>
  );
};

export default ConfessionForm;