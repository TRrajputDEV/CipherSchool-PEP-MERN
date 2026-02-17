import { useState } from "react";
import { createConfession } from "../api/api";

const ConfessionForm = ({ onCreated }) => {
  const [text, setTextState]             = useState("");
  const [secretCode, setSecretCode] = useState("");
  const [error, setError]           = useState("");
  const [loading, setLoading]       = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!text.trim())          return setError("Confession cannot be empty.");
    if (secretCode.length < 4) return setError("Secret code must be at least 4 characters.");

    setLoading(true);
    try {
      const res = await createConfession({ text, secretCode });
      onCreated(res.data);
      setTextState("");
      setSecretCode("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post confession.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-5 flex flex-col gap-3"
    >
      {/* Label */}
      <span
        className="text-sm tracking-[0.15em] text-[#ff3c3c]"
        style={{ fontFamily: "'Bebas Neue', sans-serif" }}
      >
        SHARE ANONYMOUSLY
      </span>

      {/* Text area */}
      <textarea
        rows={4}
        maxLength={1000}
        value={text}
        onChange={(e) => setTextState(e.target.value)}
        placeholder="What's on your mind? No one will know it's you..."
        className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-lg text-[#f0ede8] placeholder-[#6b6866] text-sm px-4 py-3 resize-y outline-none focus:border-[#ff3c3c] transition leading-relaxed"
      />

      {/* Bottom row: secret input + submit */}
      <div className="flex gap-3 flex-wrap">
        <input
          type="password"
          autoComplete="off"
          value={secretCode}
          onChange={(e) => setSecretCode(e.target.value)}
          placeholder="🔑 Secret code (min 4 chars)"
          className="flex-1 min-w-[180px] bg-[#1e1e1e] border border-[#2a2a2a] rounded-lg text-[#f0ede8] placeholder-[#6b6866] text-sm px-4 py-3 outline-none focus:border-[#ff3c3c] transition"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-[#ff3c3c] text-white text-base px-6 py-3 rounded-lg hover:opacity-85 hover:-translate-y-0.5 active:translate-y-0 transition disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.08em" }}
        >
          {loading ? "Posting..." : "CONFESS"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-[#ff3c3c] bg-[rgba(255,60,60,0.08)] border border-[rgba(255,60,60,0.2)] px-3 py-2 rounded-lg">
          {error}
        </p>
      )}

      {/* Hint */}
      <p className="text-xs text-[#6b6866] leading-relaxed">
        💡 Remember your secret code — you'll need it to edit or delete this confession.
      </p>
    </form>
  );
};

export default ConfessionForm;