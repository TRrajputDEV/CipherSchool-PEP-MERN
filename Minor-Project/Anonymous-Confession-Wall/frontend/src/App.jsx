import { AuthProvider, useAuth } from "./context/AuthContext";
import HomePage from "./pages/HomePage";

const AppContent = () => {
  const { loading } = useAuth();

  // Always show HomePage — confessions are public.
  // Loading state is handled inside HomePage itself.
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <span
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          className="text-[#3a3836] tracking-[0.25em] text-xs"
        >
          LOADING
        </span>
      </div>
    );
  }

  return <HomePage />;
};

const App = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;