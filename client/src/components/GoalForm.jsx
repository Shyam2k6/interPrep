import { useState } from "react";

function GoalForm({ onAddGoal }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Personal");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) return;
    onAddGoal({ title, category });
    setTitle("");
    setCategory("Personal");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h3 className="text-lg font-semibold text-slate-900">Add a new goal</h3>
      <input
        type="text"
        placeholder="Enter a goal"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none ring-0 transition focus:border-slate-900"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-900"
      >
        <option value="Programming">Programming</option>
        <option value="Interview Prep">Interview Prep</option>
        <option value="College">College</option>
        <option value="Personal">Personal</option>
        <option value="Fitness">Fitness</option>
      </select>
      <button
        type="submit"
        className="w-full rounded-full bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
      >
        Add goal
      </button>
    </form>
  );
}

export default GoalForm;
