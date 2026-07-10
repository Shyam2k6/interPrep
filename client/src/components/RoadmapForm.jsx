import { useState } from "react";

function RoadmapForm({ onAddRoadmap }) {
  const [title, setTitle] = useState("");
  const [steps, setSteps] = useState([{ title: "" }]);

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
    onAddRoadmap({ title, steps });
    setTitle("");
    setSteps([{ title: "" }]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h3 className="text-lg font-semibold text-slate-900">Create a roadmap</h3>
      <input
        type="text"
        placeholder="Roadmap title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-900"
      />

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

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={addStep}
          className="rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Add step
        </button>
        <button
          type="submit"
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
        >
          Create roadmap
        </button>
      </div>
    </form>
  );
}

export default RoadmapForm;
