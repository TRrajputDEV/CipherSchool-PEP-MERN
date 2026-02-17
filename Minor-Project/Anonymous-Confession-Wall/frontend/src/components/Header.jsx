import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-[#2a2a2a] bg-[rgba(13,13,13,0.85)] backdrop-blur-md">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <span className="text-lg">🔒</span>
          <span
            className="text-lg tracking-widest text-[#f0ede8]"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            CONFESSION WALL
          </span>
        </div>

        {/* User info + logout */}
        <div className="flex items-center gap-3">
          <img
            src={user.avatar}
            alt={user.displayName}
            className="w-8 h-8 rounded-full border border-[#2a2a2a]"
          />
          <span className="text-xs text-[#6b6866] hidden sm:block max-w-[120px] truncate">
            {user.displayName}
          </span>
          <button
            onClick={logout}
            className="text-xs text-[#6b6866] border border-[#2a2a2a] px-3 py-1 rounded-md hover:border-[#ff3c3c] hover:text-[#ff3c3c] transition"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;