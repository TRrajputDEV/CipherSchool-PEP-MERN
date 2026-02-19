import { useState } from "react";
import { createConfession } from "../api/api";
import TagSelector from "./TagSelector";

const ConfessionForm = ({ onCreated, isModal = false }) => {
  const [text, setText]             = useState("");
  const [secretCode, setSecretCode] = useState("");
  const [tags, setTags]             = useState([]);
  const [error, setError]           = useState("");
  const [loading, setLoading]       = useState(false);

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
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post confession.");
    } finally {
      setLoading(false);
    }
  };

  const remaining  = charLimit - text.length;

  return (
    <div className="relative p-6 bg-[#0d0d0d]">
      
      {/* Background Warning Stamp */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.03] select-none">
         <span 
           className="text-[8rem] text-[#ff3c3c] whitespace-nowrap -rotate-12 block font-bold"
           style={{ fontFamily: 'var(--display)' }}
         >
           CONFIDENTIAL
         </span>
      </div>

      <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-5">
        
        {/* Text Area */}
        <div className="group relative">
          <textarea
            rows={5}
            maxLength={charLimit}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your confession here..."
            className="w-full bg-[#141414] border-l-2 border-[#2a2a2a] text-[#eeebe6] placeholder-[#444] p-4 text-base resize-none outline-none focus:border-[#ff3c3c] transition-colors font-light leading-relaxed"
          />
          <div className="absolute top-0 right-0 p-2 text-[10px] text-[#444] font-mono border-b border-l border-[#2a2a2a] bg-[#0d0d0d]">
            {text.length}/{charLimit}
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <label className="text-[10px] text-[#555] uppercase tracking-widest font-bold">Add Tags</label>
          <TagSelector value={tags} onChange={setTags} />
        </div>

        {/* Secret Code & Action */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="relative">
            <input
              type="password"
              autoComplete="off"
              value={secretCode}
              onChange={(e) => setSecretCode(e.target.value)}
              placeholder="Secret Code (4+ chars)"
              className="w-full bg-[#141414] border-b-2 border-[#2a2a2a] text-[#eeebe6] placeholder-[#444] px-4 py-3 outline-none focus:border-[#ff3c3c] transition-colors font-mono text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="relative overflow-hidden group bg-[#ff3c3c] text-white font-bold py-3 px-6 hover:bg-[#e53535] transition-all active:scale-[0.98]"
          >
            <span className="relative z-10 flex items-center justify-center gap-2 uppercase tracking-wider" style={{ fontFamily: 'var(--display)' }}>
              {loading ? (
                <>
                  <span className="spinner spinner-sm border-white/30 border-t-white" />
                  Encrypting...
                </>
              ) : (
                <>
                  Post Confession
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </>
              )}
            </span>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-center text-[#ff3c3c] text-xs font-mono border border-[#ff3c3c]/30 bg-[#ff3c3c]/5 p-2 mt-2">
            [ERROR]: {error}
          </div>
        )}
      </form>
    </div>
  );
};

export default ConfessionForm;