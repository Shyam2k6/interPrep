import { useState } from "react";

function GoalForm({ onAddGoal }) {
  const [title, setTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) return;
    onAddGoal({
      title,
    });

    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter goal"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <button>Add Goal</button>
    </form>
  );
}

export default GoalForm;
