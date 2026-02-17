import { useState } from "react";
import { reactConfession, updateConfession, deleteConfession } from "../api/api";

// Reaction config
const REACTIONS = [
  { type: "like",  emoji: "👍", label: "Like"  },
  { type: "love",  emoji: "❤️", label: "Love"  },
  { type: "laugh", emoji: "😂", label: "Laugh" },
];

// Small helper — how long ago was this posted?
const timeAgo = (date) => {
  const diff = (Date.now() - new Date(date)) / 1000;
  if (diff < 60)    return "just now";
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const ConfessionCard = ({ confession, onUpdated, onDeleted }) => {
  const [data, setData]         = useState(confession);
  const [mode, setMode]         = useState("view"); // "view" | "edit" | "delete"
  const [editText, setEditText] = useState(confession.text);
  const [secretCode, setSecretCode] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  // ── React ───────────────────────────────────────────────────
  const handleReact = async (type) => {
    try {
      const res = await reactConfession(data._id, type);
      setData(res.data); // update reaction counts locally
    } catch (err) {
      console.error("Reaction failed:", err);
    }
  };

  // ── Edit ────────────────────────────────────────────────────
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

  // ── Delete ───────────────────────────────────────────────────
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
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setMode("view");
    setSecretCode("");
    setError("");
    setEditText(data.text);
  };

  return (
    <div className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-5 flex flex-col gap-3 transition hover:border-[#333]">

      {/* Top row — anonymous badge + time */}
      <div className="flex items-center justify-between">
        <span className="text-xs tracking-widest text-[#6b6866]">👤 Anonymous</span>
        <span className="text-xs text-[#6b6866]">{timeAgo(data.createdAt)}</span>
      </div>

      {/* ── VIEW mode ─────────────────────────────────────────── */}
      {mode === "view" && (
        <>
          <p className="text-sm text-[#f0ede8] leading-relaxed">{data.text}</p>

          {/* Reactions + action buttons */}
          <div className="flex items-center justify-between flex-wrap gap-3 pt-1">
            {/* Reaction buttons */}
            <div className="flex gap-2">
              {REACTIONS.map(({ type, emoji, label }) => (
                <button
                  key={type}
                  onClick={() => handleReact(type)}
                  className="flex items-center gap-1.5 text-xs text-[#6b6866] bg-[#1e1e1e] border border-[#2a2a2a] px-3 py-1.5 rounded-full hover:border-[#444] hover:text-[#f0ede8] transition"
                >
                  <span>{emoji}</span>
                  <span>{data.reactions[type]}</span>
                </button>
              ))}
            </div>

            {/* Edit / Delete toggles */}
            <div className="flex gap-2">
              <button
                onClick={() => { setMode("edit"); setError(""); }}
                className="text-xs text-[#6b6866] hover:text-[#f0ede8] transition px-2 py-1"
              >
                Edit
              </button>
              <button
                onClick={() => { setMode("delete"); setError(""); }}
                className="text-xs text-[#ff3c3c] hover:text-red-400 transition px-2 py-1"
              >
                Delete
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── EDIT mode ─────────────────────────────────────────── */}
      {mode === "edit" && (
        <form onSubmit={handleEdit} className="flex flex-col gap-3">
          <textarea
            rows={3}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-lg text-[#f0ede8] text-sm px-4 py-3 resize-y outline-none focus:border-[#ff3c3c] transition"
          />
          <input
            type="password"
            autoComplete="off"
            value={secretCode}
            onChange={(e) => setSecretCode(e.target.value)}
            placeholder="🔑 Enter secret code to confirm"
            className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-lg text-[#f0ede8] placeholder-[#6b6866] text-sm px-4 py-2.5 outline-none focus:border-[#ff3c3c] transition"
          />
          {error && <p className="text-xs text-[#ff3c3c]">{error}</p>}
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={resetForm}
              className="text-xs text-[#6b6866] border border-[#2a2a2a] px-4 py-2 rounded-lg hover:border-[#444] transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="text-xs bg-[#f0ede8] text-[#111] font-semibold px-4 py-2 rounded-lg hover:opacity-85 transition disabled:opacity-40"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      )}

      {/* ── DELETE mode ───────────────────────────────────────── */}
      {mode === "delete" && (
        <form onSubmit={handleDelete} className="flex flex-col gap-3">
          <p className="text-xs text-[#ff3c3c] bg-[rgba(255,60,60,0.06)] border border-[rgba(255,60,60,0.15)] px-3 py-2 rounded-lg">
            ⚠️ Enter your secret code to permanently delete this confession.
          </p>
          <input
            type="password"
            autoComplete="off"
            value={secretCode}
            onChange={(e) => setSecretCode(e.target.value)}
            placeholder="🔑 Secret code"
            className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-lg text-[#f0ede8] placeholder-[#6b6866] text-sm px-4 py-2.5 outline-none focus:border-[#ff3c3c] transition"
          />
          {error && <p className="text-xs text-[#ff3c3c]">{error}</p>}
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={resetForm}
              className="text-xs text-[#6b6866] border border-[#2a2a2a] px-4 py-2 rounded-lg hover:border-[#444] transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="text-xs bg-[#ff3c3c] text-white font-semibold px-4 py-2 rounded-lg hover:opacity-85 transition disabled:opacity-40"
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </form>
      )}

    </div>
  );
};

export default ConfessionCard;