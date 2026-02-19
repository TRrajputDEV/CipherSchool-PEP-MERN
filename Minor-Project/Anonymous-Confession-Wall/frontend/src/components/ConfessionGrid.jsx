import ConfessionCard from "./ConfessionCard";

const ConfessionGrid = ({ confessions, onUpdated, onDeleted, isAuthenticated }) => {
  return (
    <div className="
      grid gap-4
      grid-cols-1
      sm:grid-cols-2
      lg:grid-cols-3
      auto-rows-auto
    ">
      {confessions.map((c, i) => (
        <div
          key={c._id}
          className={`anim-fade-up delay-${Math.min(i % 6, 6)}`}
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
  );
};

export default ConfessionGrid;