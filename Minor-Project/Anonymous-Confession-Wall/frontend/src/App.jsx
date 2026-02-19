import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage"; // We will create this next

const AppContent = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen bg-[#030303] text-white flex flex-col items-center justify-center min-h-screen">
        <div className="spinner border-white/20 border-t-white" />
        <span
          style={{ fontFamily: 'var(--font-sans)' }}
          className="text-[#555] tracking-[0.3em] text-[10px] mt-4 uppercase"
        >
          Decrypting
        </span>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  );
};

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  </BrowserRouter>
);

export default App;