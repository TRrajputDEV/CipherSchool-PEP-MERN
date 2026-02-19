import { useState } from "react";
import Sidebar from "./Sidebar";
import ConfessionModal from "./ConfessionModal"; // Import your new modal

const Layout = ({ children, onConfessionCreated }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#0d0d0d]">
      {/* Pass the trigger function to the Sidebar */}
      <Sidebar onOpenModal={() => setIsModalOpen(true)} />
      
      <main className="flex-1 lg:ml-72 relative z-0">
        {children}
      </main>

      {/* The Modal sits on top of everything */}
      <ConfessionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onCreated={onConfessionCreated}
      />
    </div>
  );
};

export default Layout;