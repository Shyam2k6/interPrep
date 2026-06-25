function GoalCard({ goal, onDelete, onUpdate }) {
  return (
    <div className="goal-card">
      <h3>{goal.title}</h3>

      <p>Status: {goal.status}</p>

      <p>Progress: {goal.progress}%</p>

      <button onClick={() => onUpdate(goal._id)}>Complete</button>

      <button onClick={() => onDelete(goal._id)}>Delete</button>
    </div>
  );
}

export default GoalCard;
