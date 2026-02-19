import { useState } from "react";
import { createConfession } from "../api/api";
import TagSelector from "./TagSelector";

const ConfessionForm = ({ onCreated, isModal = false }) => {
  const [text, setText]             = useState("");
  const [secretCode, setSecretCode] = useState("");
  const [tags, setTags]             = useState([]);
  const [error, setError]           = useState("");
  const [loadingType, setLoadingType] = useState(null); // 'published', 'draft', or null

  const charLimit = 600;

  const submitForm = async (e, status) => {
    e.preventDefault();
    setError("");
    if (!text.trim())          return setError("The page remains empty.");
    if (secretCode.length < 4) return setError("Secret code must be at least 4 characters.");
    
    setLoadingType(status);
    try {
      // Send the status ("published" or "draft") to the backend
      const res = await createConfession({ text, secretCode, tags, status });
      onCreated(res.data);
      setText("");
      setSecretCode("");
      setTags([]);
    } catch (err) {
      setError(err.response?.data?.message || "Could not commit entry.");
    } finally {
      setLoadingType(null);
    }
  };

  return (
    <div className={`relative ${isModal ? 'p-8' : 'p-0'}`}>
      <form className="relative z-10 flex flex-col gap-8">
        
        {/* Text Area - Serif Font for elegant typing */}
        <div className="relative">
          <textarea
            rows={5}
            maxLength={charLimit}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What weighs on your mind?"
            className="w-full bg-transparent border-none text-[#eee] placeholder-[#444] text-xl sm:text-2xl resize-none outline-none font-light leading-relaxed"
            style={{ fontFamily: 'var(--font-serif)' }}
          />
          <div className="absolute -bottom-4 right-0 text-[10px] text-[#444] tracking-widest font-sans uppercase">
            {text.length} / {charLimit}
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-3 pt-4 border-t border-white/5">
          <label className="text-[10px] text-[#666] uppercase tracking-[0.2em] font-medium">Categorize</label>
          <TagSelector value={tags} onChange={setTags} />
        </div>

        {/* Footer actions */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pt-4">
          
          <div className="w-full lg:w-1/3">
            <input
              type="password"
              autoComplete="off"
              value={secretCode}
              onChange={(e) => setSecretCode(e.target.value)}
              placeholder="Secret Code (to edit/delete)"
              className="w-full bg-transparent border-b border-white/10 text-white placeholder-[#555] py-2 outline-none focus:border-white transition-colors text-xs tracking-widest"
              style={{ fontFamily: 'var(--font-sans)' }}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            
            {/* Save as Draft Button */}
            <button
              type="button"
              onClick={(e) => submitForm(e, 'draft')}
              disabled={!!loadingType}
              className="w-full sm:w-auto bg-transparent border border-white/20 text-white text-[10px] font-bold tracking-[0.15em] uppercase py-3 px-6 hover:bg-white/5 transition-colors active:scale-[0.98] disabled:opacity-50"
            >
              {loadingType === 'draft' ? "Filing..." : "Save Draft"}
            </button>
            
            {/* Publish Button */}
            <button
              type="button"
              onClick={(e) => submitForm(e, 'published')}
              disabled={!!loadingType}
              className="w-full sm:w-auto bg-white text-black text-[10px] font-bold tracking-[0.15em] uppercase py-3 px-8 hover:bg-[#e0e0e0] transition-colors active:scale-[0.98] disabled:opacity-50"
            >
              {loadingType === 'published' ? "Committing..." : "Publish Entry"}
            </button>

          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-[#ff4444] text-[10px] tracking-widest uppercase text-center pt-2">
            [ ERROR: {error} ]
          </div>
        )}
      </form>
    </div>
  );
};

export default ConfessionForm;