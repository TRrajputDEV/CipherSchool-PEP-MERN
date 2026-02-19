import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ onOpenModal }) => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
  };

  return (
    <>
      {/* Mobile Menu Button - Styled like a taped note */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="lg:hidden fixed top-5 left-5 z-40 w-12 h-10 flex items-center justify-center bg-[#111] border border-white/10 shadow-lg transition-transform active:scale-95 group"
        >
          {/* Tiny tape on the mobile button */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-3 bg-white/10 backdrop-blur-md rotate-[-5deg]" />
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#eee" strokeWidth="1.5">
            <path d="M4 12h16M4 6h16M4 18h16" />
          </svg>
        </button>
      )}

      {/* Mobile Overlay with heavy dark blur */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-72 bg-[#0a0a0a] border-r border-white/10 shadow-[8px_0_30px_rgba(0,0,0,0.8)]
          flex flex-col z-50 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Subtle Paper Texture for the whole Sidebar */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />

        {/* ── HEADER: The Case File ── */}
        <div className="px-8 pt-12 pb-8 shrink-0 relative z-10 flex justify-between items-start">
          
          {/* Tape holding the header */}
          <div className="absolute top-4 left-6 w-16 h-6 bg-white/10 backdrop-blur-md rotate-[4deg] shadow-sm pointer-events-none z-20" />
          
          <div className="flex flex-col relative z-10 pt-2">
            <span className="text-[#888] text-[9px] tracking-[0.3em] font-mono mb-1">
              FILE NO. 001
            </span>
            <span
              className="text-red-600 tracking-[0.2em] text-3xl font-light italic"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              String
            </span>
            <span className="text-[#555] text-[10px] tracking-[0.2em] uppercase mt-2 border-b border-dashed border-[#333] pb-1 inline-block">
              Classified Dossier
            </span>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-[#555] hover:text-white transition-colors mt-2"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── CTA: Add Evidence ── */}
        {user && (
          <div className="px-8 pb-8 shrink-0 relative z-10">
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenModal();
              }}
              className="
                group relative w-full flex items-center justify-center gap-3
                bg-[#111] text-[#eee] font-bold text-xs py-4 px-4
                border-2 border-dashed border-white/20
                transition-all duration-300
                hover:bg-white hover:text-black hover:border-solid hover:border-white
                active:scale-[0.98]
              "
              style={{ fontFamily: 'var(--font-sans)', tracking: '0.1em', textTransform: 'uppercase' }}
            >
              {/* Corner Tape on Button */}
              <div className="absolute -top-2 -right-2 w-8 h-4 bg-white/20 backdrop-blur-md rotate-45 pointer-events-none transition-opacity group-hover:opacity-0" />
              
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              Log Evidence
            </button>
          </div>
        )}

        {/* ── NAVIGATION: Index Tabs ── */}
        <nav className="flex-1 px-8 py-2 overflow-y-auto relative z-10">
          <span className="text-[#444] text-[9px] font-mono tracking-widest mb-4 block">INDEX</span>
          <ul className="space-y-4">
            <li>
              <a
                href="/"
                className="group flex items-center gap-4 text-sm text-[#eee] transition-all"
              >
                <span className="w-1.5 h-1.5 bg-white rounded-full opacity-100 group-hover:scale-150 transition-transform" />
                <span className="tracking-widest uppercase text-xs font-bold" style={{ fontFamily: 'var(--font-serif)' }}>The Board</span>
              </a>
            </li>
            {user && (
              <li>
                <a
                  href="/profile"
                  className="group flex items-center gap-4 text-sm text-[#777] hover:text-[#eee] transition-all"
                >
                  <span className="w-1.5 h-1.5 bg-[#444] group-hover:bg-white rounded-full transition-colors" />
                  <span className="tracking-widest uppercase text-xs font-bold" style={{ fontFamily: 'var(--font-serif)' }}>My Logs</span>
                </a>
              </li>
            )}
          </ul>
        </nav>

        {/* ── USER PROFILE: Polaroid Style ── */}
        <div className="p-8 shrink-0 relative z-10 border-t border-dashed border-white/10">
          {user ? (
            <div className="relative group">
              
              {/* Paperclip graphic holding the photo */}
              <div className="absolute -top-5 left-4 z-20 text-[#666] rotate-12 pointer-events-none">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
              </div>

              <div className="flex items-center justify-between bg-[#050505] p-3 border border-white/10 shadow-md transform rotate-[-1deg] transition-transform group-hover:rotate-0">
                <div className="flex items-center gap-4 min-w-0">
                  
                  {/* Polaroid Photo Frame */}
                  <div className="w-10 h-10 bg-white p-0.5 shadow-sm flex items-center justify-center shrink-0 rotate-[3deg]">
                     <img src={user.avatar} alt="User" className="w-full h-full object-cover grayscale contrast-125" />
                  </div>
                  
                  <div className="flex flex-col min-w-0">
                    <span className="text-[#888] text-[8px] font-mono tracking-widest uppercase">Agent</span>
                    <span className="text-xs text-[#eee] font-bold truncate tracking-wider" style={{ fontFamily: 'var(--font-serif)' }}>
                      {user.displayName}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={logout}
                  className="text-[#555] hover:text-[#ff4444] transition-colors p-2"
                  title="Sign out / Burn Burner"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="w-full flex items-center justify-center gap-3 bg-transparent border border-white/20 text-white text-[10px] font-bold tracking-widest uppercase py-4 px-4 hover:bg-white hover:text-black transition-all duration-300"
            >
              Authenticate to Enter
            </button>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;