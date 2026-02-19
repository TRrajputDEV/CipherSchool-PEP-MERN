import { useState, useEffect } from "react";
import { getPredefinedTags } from "../api/api";

const TagSelector = ({ value = [], onChange, maxTags = 5 }) => {
  const [predefined, setPredefined] = useState([]);
  const [customInput, setCustomInput] = useState("");

  useEffect(() => {
    getPredefinedTags()
      .then((res) => setPredefined(res.data.tags))
      .catch((err) => console.error("Failed to load tags:", err));
  }, []);

  const addTag = (tag) => {
    const normalized = tag.toLowerCase().trim();
    if (!normalized || value.includes(normalized) || value.length >= maxTags) return;
    onChange([...value, normalized]);
  };

  const removeTag = (tag) => {
    onChange(value.filter((t) => t !== tag));
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (customInput.trim()) {
      addTag(customInput.trim());
      setCustomInput("");
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Selected tags */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 text-xs bg-[rgba(255,60,60,0.1)] text-[#ff3c3c] border border-[rgba(255,60,60,0.2)] px-2.5 py-1 rounded-full"
            >
              #{tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:text-[#cc2e2e] transition"
              >
                ×
              </button>
            </span>
          ))}
          {value.length >= maxTags && (
            <span className="text-[10px] text-[#555250] self-center">
              Max {maxTags} tags
            </span>
          )}
        </div>
      )}

      {/* Predefined tags */}
      {value.length < maxTags && (
        <div className="flex flex-wrap gap-1.5">
          {predefined
            .filter((t) => !value.includes(t))
            .slice(0, 8)
            .map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => addTag(tag)}
                className="text-[11px] text-[#6e6c6a] border border-[#242424] px-2.5 py-1 rounded-full hover:border-[#ff3c3c] hover:text-[#ff3c3c] transition"
              >
                #{tag}
              </button>
            ))}
        </div>
      )}

      {/* Custom tag input */}
      {value.length < maxTags && (
        <form onSubmit={handleCustomSubmit} className="flex gap-2">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Add custom tag..."
            maxLength={20}
            className="flex-1 text-xs bg-[#0d0d0d] border border-[#1e1e1e] rounded-lg text-[#eeebe6] placeholder-[#555250] px-3 py-1.5 outline-none focus:border-[#2a2a2a] transition"
          />
          <button
            type="submit"
            className="text-xs text-[#6e6c6a] border border-[#1e1e1e] px-3 py-1.5 rounded-lg hover:border-[#ff3c3c] hover:text-[#ff3c3c] transition"
          >
            Add
          </button>
        </form>
      )}
    </div>
  );
};

export default TagSelector;