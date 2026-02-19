import { useEffect } from "react";
import ConfessionForm from "./ConfessionForm";

const ConfessionModal = ({ isOpen, onClose, onCreated }) => {
  if (!isOpen) return null;

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Editorial Backdrop */}
      <div 
        className="absolute inset-0 bg-[#030303]/85 backdrop-blur-md transition-opacity duration-500"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-xl bg-[#0a0a0a] border border-white/10 shadow-2xl anim-scale-in flex flex-col">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-white/5">
          <span 
            className="text-white text-2xl font-light italic"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Leave a trace...
          </span>
          <button 
            onClick={onClose}
            className="text-[#555] hover:text-white transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Form Content */}
        <ConfessionForm 
          onCreated={(data) => {
            onCreated(data);
            onClose();
          }} 
          isModal={true} 
        />
      </div>
    </div>
  );
};

export default ConfessionModal;