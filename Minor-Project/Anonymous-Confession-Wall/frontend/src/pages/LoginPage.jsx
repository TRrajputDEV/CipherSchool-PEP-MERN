const LoginPage = () => {
  const handleGoogleLogin = () => {
    // Redirect to backend — Passport handles the rest
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0d0d]">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(255,60,60,0.15),transparent)] pointer-events-none" />

      <div className="relative z-10 w-[90%] max-w-md bg-[#161616] border border-[#2a2a2a] rounded-xl p-10 text-center">
        {/* Tag */}
        <span className="inline-block text-[0.7rem] font-semibold tracking-[0.25em] text-[#ff3c3c] bg-[rgba(255,60,60,0.1)] border border-[rgba(255,60,60,0.25)] px-3 py-1 rounded-full mb-5">
          ANONYMOUS
        </span>

        {/* Title */}
        <h1
          className="text-[4.5rem] leading-none tracking-wider text-[#f0ede8] mb-4"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          CONFESSION<br />WALL
        </h1>

        {/* Subtitle */}
        <p className="text-sm text-[#6b6866] mb-8 leading-relaxed">
          Speak freely. Be heard. Stay anonymous.
        </p>

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-3 w-full bg-[#f0ede8] text-[#111] font-semibold text-sm py-3 px-6 rounded-lg transition hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(255,255,255,0.12)] active:translate-y-0"
        >
          {/* Google SVG logo */}
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default LoginPage;