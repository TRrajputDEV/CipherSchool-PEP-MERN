import { useEffect, useState } from "react";
import { getConfessions, getPredefinedTags } from "../api/api";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import ConfessionGrid from "../components/ConfessionGrid";
import Pagination from "../components/Pagination";
import CommentModal from "../components/CommentModal"; // <-- Import the Modal

const ArchiveSearch = ({ onSearch, isSearching }) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(input);
  };

  const handleClear = () => {
    setInput("");
    onSearch("");
  };

  return (
    <div className="max-w-2xl mx-auto mb-6 anim-fade-in relative z-10">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-white/0 via-white/5 to-white/0 blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative flex items-center bg-[#0a0a0a] border border-white/10 p-2 sm:p-3 shadow-[0_8px_30px_rgb(0,0,0,0.6)]">
          <span className="text-[#555] pl-3 pr-2 font-mono text-xs tracking-widest">{'>'}</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Query the archives..."
            className="flex-1 bg-transparent border-none text-white placeholder-[#444] text-lg sm:text-xl outline-none font-light italic w-full"
            style={{ fontFamily: 'var(--font-serif)' }}
          />
          <div className="flex items-center gap-2 pr-2">
            {input && (
              <button type="button" onClickQuery={handleClear} className="text-[#555] hover:text-[#ff4444] px-2 transition-colors font-mono text-[10px] tracking-widest uppercase">
                Clear
              </button>
            )}
            <button type="submit" disabled={isSearching} className="bg-white/10 hover:bg-white text-white hover:text-black transition-colors px-4 py-2 text-[10px] font-bold tracking-widest uppercase disabled:opacity-50">
              Search
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

const SectionHeader = ({ total, searchTerm, activeTag }) => {
  let title = "Public Evidence Board";
  if (searchTerm && activeTag) title = `Searching "${searchTerm}" in #${activeTag}`;
  else if (searchTerm) title = `Search Results for "${searchTerm}"`;
  else if (activeTag) title = `Cross-Referenced: #${activeTag}`;

  return (
    <div className="flex flex-col items-center justify-center mb-8 border-b border-white/5 pb-4">
      <span className="text-[10px] tracking-[0.4em] text-[#555] font-mono uppercase text-center">{title}</span>
      {total > 0 && <span className="text-white text-[9px] tracking-[0.2em] font-mono mt-2 uppercase">{total} {total === 1 ? 'Record' : 'Records'} Found</span>}
    </div>
  );
};

const EmptyState = ({ isFiltering }) => (
  <div className="flex flex-col items-center justify-center py-32 opacity-40 border border-dashed border-white/5 mx-4">
    <span className="text-3xl mb-4 font-serif text-white italic text-center">{isFiltering ? "No Matching Records" : "The Board is Empty"}</span>
    <p className="text-[10px] font-mono tracking-widest uppercase text-[#888] text-center">{isFiltering ? "Try adjusting your query or removing filters." : "No evidence has been logged yet."}</p>
  </div>
);

const HomePage = () => {
  const { user } = useAuth();
  const [confessions, setConfessions] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [pagination, setPagination]   = useState({ page: 1, totalPages: 1, total: 0 });
  
  const [activeSearch, setActiveSearch] = useState(""); 
  const [activeTag, setActiveTag]       = useState("");
  const [predefinedTags, setPredefinedTags] = useState([]);

  // NEW STATE: Tracks which card was clicked to open the modal
  const [selectedConfession, setSelectedConfession] = useState(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await getPredefinedTags();
        setPredefinedTags(res.data.tags || []);
      } catch (err) { console.error(err); }
    };
    fetchTags();
  }, []);

  const loadConfessions = async (page = 1, search = activeSearch, tag = activeTag) => {
    setLoading(true);
    try {
      const res = await getConfessions({ page, limit: 12, search, tag });
      const list = Array.isArray(res.data?.confessions) ? res.data.confessions.filter((c) => c && c._id) : [];
      setConfessions(list);
      setPagination(res.data?.pagination || { page: 1, totalPages: 1, total: 0 });
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  useEffect(() => {
    loadConfessions(1, activeSearch, activeTag);
  }, [activeSearch, activeTag]);

  const handlePageChange = (newPage) => {
    loadConfessions(newPage, activeSearch, activeTag);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCreated = (newItem) => {
    if (!newItem || !newItem._id) return;
    loadConfessions(1, activeSearch, activeTag);
  };

  const handleUpdated = (updated) => setConfessions((prev) => prev.map((c) => (c._id === updated._id ? updated : c)));
  const handleDeleted = (id) => {
    setConfessions((prev) => prev.filter((c) => c._id !== id));
    if (confessions.length === 1 && pagination.page > 1) loadConfessions(pagination.page - 1, activeSearch, activeTag);
  };

  return (
    <Layout onConfessionCreated={handleCreated}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        <ArchiveSearch onSearch={setActiveSearch} isSearching={loading} />

        {predefinedTags.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10 anim-slide-up delay-0">
            {predefinedTags.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveTag(prev => prev === tag ? "" : tag)}
                className={`text-[9px] sm:text-[10px] uppercase tracking-[0.15em] border px-3 py-1.5 transition-all duration-300 ${activeTag === tag ? "bg-white text-black border-white font-bold scale-105 shadow-[0_0_15px_rgba(255,255,255,0.2)]" : "bg-transparent text-[#666] border-white/10 hover:border-white/40 hover:text-white"}`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        <div className="anim-slide-up delay-1">
          <SectionHeader total={pagination.total} searchTerm={activeSearch} activeTag={activeTag} />
        </div>

        <div className="anim-slide-up delay-2">
          {loading ? (
            <div className="flex justify-center py-32"><div className="spinner border-white/20 border-t-white" /></div>
          ) : confessions.length === 0 ? (
            <EmptyState isFiltering={!!activeSearch || !!activeTag} />
          ) : (
            <>
              <ConfessionGrid
                confessions={confessions}
                onUpdated={handleUpdated}
                onDeleted={handleDeleted}
                isAuthenticated={!!user}
                onCardClick={setSelectedConfession} // <-- Passed into the Grid here!
              />
              {pagination.totalPages > 1 && (
                <div className="mt-12 flex justify-center">
                  <Pagination currentPage={pagination.page} totalPages={pagination.totalPages} onPageChange={handlePageChange} />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── THE MODAL ── */}
      <CommentModal 
        confession={selectedConfession} 
        onClose={() => setSelectedConfession(null)} 
      />
    </Layout>
  );
};

export default HomePage;