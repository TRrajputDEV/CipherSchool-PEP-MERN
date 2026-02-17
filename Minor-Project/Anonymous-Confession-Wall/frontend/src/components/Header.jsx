import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();

  const handleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#181818] bg-[rgba(13,13,13,0.9)] backdrop-blur-md anim-slide-down">
      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">

        {/* Brand */}
        <div className="flex items-center gap-2.5 shrink-0">
          <svg
            width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="#ff3c3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <span
            className="text-[#eeebe6] tracking-[0.1em]"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem" }}
          >
            CONFESSION WALL
          </span>
        </div>

        {/* Right side — user info or sign-in button */}
        {user ? (
          <div className="flex items-center gap-3 min-w-0">
            {/* Avatar with online dot */}
            <div className="relative shrink-0">
              <img
                src={user.avatar}
                alt={user.displayName}
                className="w-7 h-7 rounded-full border border-[#242424] object-cover"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-[#22c55e] rounded-full border border-[#0d0d0d]" />
            </div>

            {/* Name — hidden on small screens */}
            <span className="text-xs text-[#6e6c6a] hidden sm:block truncate max-w-[140px] font-light">
              {user.displayName}
            </span>

            {/* Sign out */}
            <button
              onClick={logout}
              className="
                shrink-0 text-xs text-[#6e6c6a] border border-[#1e1e1e]
                px-3 py-1.5 rounded-lg
                transition-all duration-150
                hover:border-[#ff3c3c] hover:text-[#ff3c3c]
                active:scale-95
              "
            >
              Sign out
            </button>
          </div>
        ) : (
          /* Guest — show a subtle sign-in link */
          <button
            onClick={handleLogin}
            className="
              flex items-center gap-2 text-xs text-[#5a5856] border border-[#1e1e1e]
              px-3.5 py-1.5 rounded-lg
              transition-all duration-150
              hover:border-[#2a2a2a] hover:text-[#eeebe6]
              active:scale-95
            "
          >
            Sign in
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;