import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getMyConfessions, getMyProfile } from "../api/api";
import Layout from "../components/Layout";
import ConfessionGrid from "../components/ConfessionGrid";
import CommentModal from "../components/CommentModal"; // <-- Import Modal

const ProfilePage = () => {
  const { user } = useAuth();
  const [profileStats, setProfileStats] = useState(null);
  const [confessions, setConfessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("published"); 
  
  // NEW STATE: For the modal
  const [selectedConfession, setSelectedConfession] = useState(null);

  const loadDossier = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [profileRes, confessionsRes] = await Promise.all([
        getMyProfile(),
        getMyConfessions({ status: activeTab, limit: 50 })
      ]);
      setProfileStats(profileRes.data.stats);
      setConfessions(confessionsRes.data.confessions || []);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  useEffect(() => { loadDossier(); }, [user, activeTab]);

  const handleCreated = () => loadDossier(); 

  const handleDeleted = (id) => {
    setConfessions((prev) => prev.filter((c) => c._id !== id));
    if (profileStats) setProfileStats(prev => ({ ...prev, [activeTab === 'published' ? 'published' : 'drafts']: Math.max(0, prev[activeTab === 'published' ? 'published' : 'drafts'] - 1) }));
  };

  const handleUpdated = (updated) => {
    if (updated.status !== activeTab) {
      setConfessions((prev) => prev.filter((c) => c._id !== updated._id));
      if (profileStats) setProfileStats(prev => ({
        ...prev,
        published: updated.status === 'published' ? prev.published + 1 : Math.max(0, prev.published - 1),
        drafts: updated.status === 'draft' ? prev.drafts + 1 : Math.max(0, prev.drafts - 1)
      }));
    } else {
      setConfessions((prev) => prev.map((c) => (c._id === updated._id ? updated : c)));
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen text-[#555] font-mono tracking-widest uppercase text-xs">
          [ ACCESS DENIED - AUTHENTICATION REQUIRED ]
        </div>
      </Layout>
    );
  }

  return (
    <Layout onConfessionCreated={handleCreated}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <div className="mb-12 border-b border-white/10 pb-8 relative anim-fade-in">
          <div className="absolute top-0 right-0 border-2 border-[#ff3c3c]/40 text-[#ff3c3c]/40 text-[10px] font-bold tracking-[0.3em] uppercase px-3 py-1 rotate-[4deg] pointer-events-none select-none">Classified</div>
          <span className="text-[#555] text-[10px] tracking-[0.3em] font-mono uppercase block mb-2">Subject Dossier</span>
          <h1 className="text-white text-4xl sm:text-5xl font-light italic mb-6" style={{ fontFamily: 'var(--font-serif)' }}>{user.displayName}'s Logs</h1>
          <div className="flex gap-8 text-[10px] tracking-[0.2em] font-mono uppercase">
            <div className="flex flex-col gap-1"><span className="text-[#555]">Archived Evidence</span><span className="text-white text-sm">{profileStats?.published || 0} Entries</span></div>
            <div className="flex flex-col gap-1"><span className="text-[#555]">Unfiled Drafts</span><span className="text-[#888] text-sm">{profileStats?.drafts || 0} Pending</span></div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 mb-8 anim-slide-up delay-1">
          <button onClick={() => setActiveTab("published")} className={`text-xs tracking-[0.2em] uppercase font-bold pb-2 transition-all ${activeTab === "published" ? "text-white border-b border-white" : "text-[#555] border-b border-transparent hover:text-[#888]"}`}>The Archive</button>
          <button onClick={() => setActiveTab("draft")} className={`text-xs tracking-[0.2em] uppercase font-bold pb-2 transition-all ${activeTab === "draft" ? "text-white border-b border-white" : "text-[#555] border-b border-transparent hover:text-[#888]"}`}>Rough Notes</button>
        </div>

        {/* Grid */}
        <div className="anim-slide-up delay-2">
          {loading ? (
             <div className="flex justify-center py-20"><div className="spinner border-white/20 border-t-white" /></div>
          ) : confessions.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-32 opacity-40 border border-dashed border-white/5">
                <span className="text-3xl mb-4 font-serif text-white italic">Empty Folder</span>
                <p className="text-[10px] font-mono tracking-widest uppercase text-[#888]">{activeTab === 'published' ? 'No evidence published.' : 'No drafts pending.'}</p>
             </div>
          ) : (
            <ConfessionGrid
              confessions={confessions}
              onUpdated={handleUpdated}
              onDeleted={handleDeleted}
              isAuthenticated={true}
              onCardClick={setSelectedConfession} // <-- Passed to grid here!
            />
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

export default ProfilePage;