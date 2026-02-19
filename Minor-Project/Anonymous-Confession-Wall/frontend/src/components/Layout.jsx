import Sidebar from "./Sidebar";

const Layout = ({ children, onConfessionCreated }) => {
  return (
    <div className="flex min-h-screen bg-[#0d0d0d]">
      <Sidebar onConfessionCreated={onConfessionCreated} />
      <main className="flex-1 lg:ml-72">
        {children}
      </main>
    </div>
  );
};

export default Layout;