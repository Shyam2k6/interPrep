function GoalCard({ goal }) {
  return (
    <div className="goal-card">
      <h3>{goal.title}</h3>

      <p>Status: {goal.status}</p>

      <p>Progress: {goal.progress}%</p>
    </div>
  );
}

export default GoalCard;
