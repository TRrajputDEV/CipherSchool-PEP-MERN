import { useEffect, useState } from "react";
import { getConfessions } from "../api/api";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import ConfessionForm from "../components/ConfessionForm";
import ConfessionCard from "../components/ConfessionCard";

// Shown when a guest tries to write a confession
const LoginPrompt = () => {
  const handleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
  };

  return (
    <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex flex-col gap-1">
        <span
          className="text-[0.68rem] tracking-[0.22em] text-[#ff3c3c]"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          WANT TO CONFESS?
        </span>
        <p className="text-sm text-[#5a5856] font-light leading-relaxed">
          Sign in with Google to post anonymously. Your name will never appear.
        </p>
      </div>
      <button
        onClick={handleLogin}
        className="
          flex items-center gap-2.5 shrink-0
          bg-[#eeebe6] text-[#111] font-semibold text-sm
          px-5 py-2.5 rounded-xl
          transition-all duration-150
          hover:bg-white hover:shadow-[0_0_24px_rgba(255,255,255,0.08)]
          active:scale-[0.97]
          whitespace-nowrap
        "
      >
        <svg width="15" height="15" viewBox="0 0 48 48" className="shrink-0">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
        </svg>
        Sign in with Google
      </button>
    </div>
  );
};

// Divider between form/prompt and the list
const SectionDivider = ({ count }) => (
  <div className="flex items-center gap-4 my-8">
    <div className="flex-1 h-px bg-[#181818]" />
    <span
      className="text-[0.65rem] tracking-[0.25em] text-[#555250] shrink-0"
      style={{ fontFamily: "'Bebas Neue', sans-serif" }}
    >
      {count > 0 ? `${count} CONFESSIONS` : "CONFESSIONS"}
    </span>
    <div className="flex-1 h-px bg-[#181818]" />
  </div>
);

// Empty state when no confessions exist yet
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-24 gap-4 anim-fade-in">
    <div className="w-12 h-12 rounded-full border border-[#1e1e1e] flex items-center justify-center">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555250" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    </div>
    <div className="flex flex-col items-center gap-1">
      <p className="text-sm text-[#6e6c6a]">No confessions yet</p>
      <p className="text-xs text-[#555250] font-light">Be the first to share something</p>
    </div>
  </div>
);

const HomePage = () => {
  const { user } = useAuth();
  const [confessions, setConfessions] = useState([]);
  const [loading, setLoading]         = useState(true);

  const loadConfessions = async () => {
    try {
      const res = await getConfessions();
      // Backend now returns { confessions: [], pagination: {} }
      const list = Array.isArray(res.data?.confessions)
        ? res.data.confessions.filter((c) => c && c._id)
        : [];
      setConfessions(list);
    } catch (err) {
      console.error("Failed to load confessions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConfessions();
  }, []);

  const handleCreated = (newItem) => {
    if (!newItem || !newItem._id) return;
    setConfessions((prev) => [newItem, ...prev]);
  };

  const handleUpdated = (updated) =>
    setConfessions((prev) =>
      prev.map((c) => (c._id === updated._id ? updated : c))
    );

  const handleDeleted = (id) =>
    setConfessions((prev) => prev.filter((c) => c._id !== id));

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <Header />

      <main className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-8 pb-24">

        {/* Form area — show write form if logged in, else login prompt */}
        <div className="anim-fade-up delay-0">
          {user ? (
            <ConfessionForm onCreated={handleCreated} />
          ) : (
            <LoginPrompt />
          )}
        </div>

        {/* Divider */}
        <div className="anim-fade-in delay-1">
          <SectionDivider count={confessions.length} />
        </div>

        {/* Confession list */}
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="spinner" />
          </div>
        ) : confessions.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="flex flex-col gap-3">
            {confessions.map((c, i) => (
              <div
                key={c._id}
                className={`anim-fade-up delay-${Math.min(i, 6)}`}
              >
                <ConfessionCard
                  confession={c}
                  onUpdated={handleUpdated}
                  onDeleted={handleDeleted}
                  isAuthenticated={!!user}
                />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;