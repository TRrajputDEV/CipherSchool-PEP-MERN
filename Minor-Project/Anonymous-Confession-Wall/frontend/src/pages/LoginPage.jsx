const LoginPage = () => {
  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0d0d] px-4 relative overflow-hidden">

      {/* Ambient background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% -5%, rgba(255,60,60,0.13) 0%, transparent 70%)",
        }}
      />
      {/* Bottom subtle glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255,60,60,0.05) 0%, transparent 70%)",
        }}
      />

      {/* Card */}
      <div className="relative z-10 w-full max-w-[420px] anim-fade-up">

        {/* Tag */}
        <div className="flex justify-center mb-6 anim-fade-in delay-1">
          <span
            className="text-[0.65rem] font-semibold tracking-[0.3em] text-[#ff3c3c] border border-[rgba(255,60,60,0.2)] bg-[rgba(255,60,60,0.07)] px-4 py-1.5 rounded-full"
          >
            ANONYMOUS
          </span>
        </div>

        {/* Title */}
        <h1
          className="text-center leading-[0.9] text-[#eeebe6] mb-5 anim-fade-up delay-2"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(3.5rem, 10vw, 5.5rem)",
            letterSpacing: "0.04em",
          }}
        >
          CONFESSION<br />WALL
        </h1>

        {/* Subtitle */}
        <p className="text-center text-[#5a5856] text-sm leading-relaxed mb-10 anim-fade-in delay-3 font-light">
          Speak freely. Be heard. Stay anonymous.
        </p>

        {/* Divider line */}
        <div className="flex items-center gap-4 mb-8 anim-fade-in delay-3">
          <div className="flex-1 h-px bg-[#1e1e1e]" />
          <span className="text-[#555250] text-xs tracking-widest">OR</span>
          <div className="flex-1 h-px bg-[#1e1e1e]" />
        </div>

        {/* Google button */}
        <button
          onClick={handleGoogleLogin}
          className="
            group relative w-full flex items-center justify-center gap-3
            bg-[#eeebe6] text-[#111] font-semibold text-sm
            py-3.5 px-6 rounded-xl
            transition-all duration-200
            hover:bg-white hover:shadow-[0_0_40px_rgba(255,255,255,0.08)]
            active:scale-[0.98]
            anim-scale-in delay-4
          "
        >
          <svg width="18" height="18" viewBox="0 0 48 48" className="shrink-0">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Continue with Google
        </button>

        {/* Footer note */}
        <p className="text-center text-[#6e6c6a] text-xs mt-6 anim-fade-in delay-5">
          Your identity is never shown to others
        </p>
      </div>
    </div>
  );
};

export default LoginPage;