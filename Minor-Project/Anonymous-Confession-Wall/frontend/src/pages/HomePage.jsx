import { useEffect, useState } from "react";
import { getConfessions } from "../api/api";
import Header from "../components/Header";
import ConfessionForm from "../components/ConfessionForm";
import ConfessionCard from "../components/ConfessionCard";

const HomePage = () => {
  const [confessions, setConfessions] = useState([]);
  const [loading, setLoading]         = useState(true);

  const loadConfessions = async () => {
    try {
      const res = await getConfessions();
      setConfessions(res.data);
    } catch (err) {
      console.error("Failed to load confessions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadConfessions(); }, []);

  // Add new confession to the top of the list
  const handleCreated = (newItem) => setConfessions((prev) => [newItem, ...prev]);

  // Replace updated confession in place
  const handleUpdated = (updated) =>
    setConfessions((prev) => prev.map((c) => (c._id === updated._id ? updated : c)));

  // Remove deleted confession
  const handleDeleted = (id) =>
    setConfessions((prev) => prev.filter((c) => c._id !== id));

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <Header />

      <main className="max-w-2xl mx-auto px-4 py-8 pb-16">
        {/* Post form */}
        <ConfessionForm onCreated={handleCreated} />

        {/* Divider */}
        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-[#2a2a2a]" />
          <span
            className="text-sm tracking-[0.2em] text-[#6b6866]"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            CONFESSIONS
          </span>
          <div className="flex-1 h-px bg-[#2a2a2a]" />
        </div>

        {/* List */}
        {loading ? (
          <p className="text-center text-[#6b6866] mt-12">Loading...</p>
        ) : confessions.length === 0 ? (
          <p className="text-center text-[#6b6866] mt-12">
            No confessions yet — be the first!
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {confessions.map((c) => (
              <ConfessionCard
                key={c._id}
                confession={c}
                onUpdated={handleUpdated}
                onDeleted={handleDeleted}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;