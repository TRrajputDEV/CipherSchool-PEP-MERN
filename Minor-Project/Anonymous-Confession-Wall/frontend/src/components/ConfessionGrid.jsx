import ConfessionCard from "./ConfessionCard";

// Added onCardClick to the props here
const ConfessionGrid = ({ confessions, onUpdated, onDeleted, isAuthenticated, onCardClick }) => {
  return (
    <div className="w-full min-h-screen p-2 sm:p-4">
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {confessions.map((c, i) => (
          <div
            key={c._id}
            className="break-inside-avoid mb-6" 
            style={{ 
              animation: `slideUpFade 0.5s ease-out forwards`,
              animationDelay: `${Math.min(i * 50, 600)}ms`,
              opacity: 0 
            }}
          >
            <ConfessionCard
              confession={c}
              onUpdated={onUpdated}
              onDeleted={onDeleted}
              isAuthenticated={isAuthenticated}
              onCardClick={onCardClick} // <-- Passed down here!
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConfessionGrid;