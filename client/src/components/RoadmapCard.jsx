function RoadmapCard({ roadmap }) {
  return (
    <div className="roadmap-card">
      <h2>{roadmap.title}</h2>

      <p>Progress: {roadmap.progress}%</p>
    </div>
  );
}

export default RoadmapCard;
