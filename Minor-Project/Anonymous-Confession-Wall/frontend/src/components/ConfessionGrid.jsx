import ConfessionCard from "./ConfessionCard";

const ConfessionGrid = ({ confessions, onUpdated, onDeleted, isAuthenticated }) => {
  return (
    <div className="w-full min-h-screen p-2 sm:p-4">
      
      {/* MASONRY LAYOUT:
         - columns-1: Mobile (1 stack)
         - md:columns-2: Tablets (2 stacks)
         - lg:columns-3: Desktops (3 stacks)
         - gap-6: Spacing between columns
      */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        
        {confessions.map((c, i) => (
          <div
            key={c._id}
            className="break-inside-avoid mb-6" 
            style={{ 
              /* Animation Stagger:
                 This creates a beautiful "wave" effect where cards 
                 load in slightly after one another based on their index.
              */
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
            />
          </div>
        ))}
        
      </div>

      {/* Empty State Helper (Optional visual cue if list is empty) */}
      {confessions.length === 0 && (
         <div className="flex flex-col items-center justify-center py-20 opacity-40">
            <span className="text-4xl mb-4 font-serif text-white italic">Empty Case File</span>
            <p className="text-xs tracking-widest uppercase text-white">No evidence logged yet.</p>
         </div>
      )}

    </div>
  );
};

export default ConfessionGrid;