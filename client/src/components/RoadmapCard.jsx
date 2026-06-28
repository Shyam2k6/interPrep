function RoadmapCard({ roadmap, onToggleStep }) {
  return (
    <div className="roadmap-card">
      <h2>{roadmap.title}</h2>

      <p>Progress: {roadmap.progress}%</p>

      {roadmap.steps.map((step) => (
        <div key={step._id}>
          <input
            type="checkbox"
            checked={step.completed}
            onChange={() => onToggleStep(roadmap._id, step._id)}
          />

          <span>{step.title}</span>
        </div>
      ))}
    </div>
  );
}

export default RoadmapCard;
