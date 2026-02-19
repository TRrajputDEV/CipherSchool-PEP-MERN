import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import ConfessionForm from "./ConfessionForm";

const Sidebar = ({ onConfessionCreated }) => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
  };

  const handleFormSuccess = (newItem) => {
    setShowForm(false);
    onConfessionCreated?.(newItem);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 flex items-center justify-center bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#eeebe6" strokeWidth="2">
          {isOpen ? (
            <path d="M18 6L6 18M6 6l12 12"/>
          ) : (
            <path d="M3 12h18M3 6h18M3 18h18"/>
          )}
        </svg>
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-72 bg-[#0d0d0d] border-r border-[#1a1a1a]
          flex flex-col z-40 transition-transform duration-300 overflow-y-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Brand */}
        <div className="p-6 border-b border-[#1a1a1a] shrink-0">
          <div className="flex items-center gap-2.5">
            <svg
              width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="#ff3c3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <span
              className="text-[#f2f0ec] tracking-[0.08em] text-sm"
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem" }}
            >
              CONFESSION WALL
            </span>
          </div>
        </div>

        {/* Add Confession Section */}
        {user && (
          <div className="p-4 border-b border-[#1a1a1a] shrink-0">
            {!showForm ? (
              <button
                onClick={() => setShowForm(true)}
                className="
                  w-full flex items-center justify-center gap-2
                  bg-[#ff3c3c] text-white font-medium text-sm
                  py-3 px-4 rounded-xl
                  transition-all duration-150
                  hover:bg-[#e53535] hover:shadow-[0_0_24px_rgba(255,60,60,0.15)]
                  active:scale-[0.98]
                "
                style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                New Confession
              </button>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className="text-[0.7rem] tracking-[0.2em] text-[#ff3c3c]"
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  >
                    NEW CONFESSION
                  </span>
                  <button
                    onClick={() => setShowForm(false)}
                    className="text-[#8a8784] hover:text-[#f2f0ec] transition"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
                <ConfessionForm onCreated={handleFormSuccess} compact />
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <ul className="space-y-1">
            <li>
              <a
                href="/"
                className="flex items-center gap-3 px-3 py-2.5 text-sm text-[#f2f0ec] bg-[rgba(255,60,60,0.1)] border-l-2 border-[#ff3c3c] rounded-r-lg"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
                Home
              </a>
            </li>
            {user && (
              <li>
                <a
                  href="/profile"
                  className="flex items-center gap-3 px-3 py-2.5 text-sm text-[#8a8784] hover:text-[#f2f0ec] hover:bg-[#1a1a1a] rounded-lg transition"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  Profile
                </a>
              </li>
            )}
          </ul>
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-[#1a1a1a] shrink-0">
          {user ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative shrink-0">
                  <img
                    src={user.avatar}
                    alt={user.displayName}
                    className="w-9 h-9 rounded-full border border-[#2a2a2a]"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#22c55e] rounded-full border-2 border-[#0d0d0d]"/>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs text-[#f2f0ec] font-medium truncate">
                    {user.displayName}
                  </span>
                  <span className="text-[10px] text-[#5c5a58]">Online</span>
                </div>
              </div>
              <button
                onClick={logout}
                className="shrink-0 text-[#8a8784] hover:text-[#ff3c3c] transition p-1.5"
                title="Sign out"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="w-full flex items-center justify-center gap-2 bg-[#ff3c3c] text-white text-sm font-medium py-2.5 px-4 rounded-lg hover:bg-[#e53535] transition"
            >
              <svg width="14" height="14" viewBox="0 0 48 48">
                <path fill="currentColor" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              </svg>
              Sign in
            </button>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;