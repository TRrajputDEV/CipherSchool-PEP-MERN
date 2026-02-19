import { useEffect, useState } from "react";
import { getConfessions } from "../api/api";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import ConfessionGrid from "../components/ConfessionGrid";
import Pagination from "../components/Pagination";

// Section header with count
const SectionHeader = ({ total }) => (
  <div className="flex items-center justify-center py-6 mb-4">
    <span
      className="text-[0.7rem] tracking-[0.3em] text-[#5c5a58]"
      style={{ fontFamily: "'Bebas Neue', sans-serif" }}
    >
      {total > 0 ? `${total} CONFESSIONS` : "CONFESSIONS"}
    </span>
  </div>
);

// Empty state
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-32 gap-4">
    <div className="w-14 h-14 rounded-full border border-[#1e1e1e] flex items-center justify-center">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5c5a58" strokeWidth="1.5">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    </div>
    <div className="flex flex-col items-center gap-1.5">
      <p className="text-sm text-[#8a8784]">No confessions yet</p>
      <p className="text-xs text-[#5c5a58] font-light">Be the first to share something</p>
    </div>
  </div>
);

const HomePage = () => {
  const { user } = useAuth();
  const [confessions, setConfessions] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [pagination, setPagination]   = useState({ page: 1, totalPages: 1, total: 0 });

  const loadConfessions = async (page = 1) => {
    setLoading(true);
    try {
      const res = await getConfessions({ page, limit: 12 });
      const list = Array.isArray(res.data?.confessions)
        ? res.data.confessions.filter((c) => c && c._id)
        : [];
      setConfessions(list);
      setPagination(res.data?.pagination || { page: 1, totalPages: 1, total: 0 });
    } catch (err) {
      console.error("Failed to load confessions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConfessions(1);
  }, []);

  const handlePageChange = (newPage) => {
    loadConfessions(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCreated = (newItem) => {
    if (!newItem || !newItem._id) return;
    loadConfessions(1);
  };

  const handleUpdated = (updated) =>
    setConfessions((prev) =>
      prev.map((c) => (c._id === updated._id ? updated : c))
    );

  const handleDeleted = (id) => {
    setConfessions((prev) => prev.filter((c) => c._id !== id));
    if (confessions.length === 1 && pagination.page > 1) {
      loadConfessions(pagination.page - 1);
    }
  };

  return (
    <Layout onConfessionCreated={handleCreated}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Section header */}
        <div className="anim-fade-in">
          <SectionHeader total={pagination.total} />
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center py-32">
            <div className="spinner" />
          </div>
        ) : confessions.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <ConfessionGrid
              confessions={confessions}
              onUpdated={handleUpdated}
              onDeleted={handleDeleted}
              isAuthenticated={!!user}
            />
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </Layout>
  );
};

export default HomePage;