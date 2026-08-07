import { useState } from "react";

function RoadmapForm({ onAddRoadmap, goals = [] }) {
  const [title, setTitle] = useState("");
  const [steps, setSteps] = useState([{ title: "" }]);
  const [goalId, setGoalId] = useState("");

  const addStep = () => {
    setSteps((prev) => [...prev, { title: "" }]);
  };

  const handleStepChange = (index, value) => {
    const updatedSteps = [...steps];
    updatedSteps[index].title = value;
    setSteps(updatedSteps);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddRoadmap({ title, steps, goal: goalId || null });
    setTitle("");
    setSteps([{ title: "" }]);
    setGoalId("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h3 className="text-lg font-semibold text-slate-900">Create a roadmap</h3>
      
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1">Title</label>
        <input
          type="text"
          placeholder="Roadmap title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-900"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1">Link to Goal (Optional)</label>
        <select
          value={goalId}
          onChange={(e) => setGoalId(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-900 cursor-pointer"
        >
          <option value="">No goal linked</option>
          {goals.map((g) => (
            <option key={g._id} value={g._id}>
              {g.title} ({g.category})
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-medium text-slate-500">Milestones</label>
        {steps.map((step, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Step ${index + 1}`}
            value={step.title}
            onChange={(e) => handleStepChange(index, e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-900"
          />
        ))}
      </div>

      <div className="flex flex-wrap gap-2 pt-2">
        <button
          type="button"
          onClick={addStep}
          className="rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 cursor-pointer"
        >
          Add step
        </button>
        <button
          type="submit"
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 cursor-pointer"
        >
          Create roadmap
        </button>
      </div>
    </form>
  );
}

export default RoadmapForm;
