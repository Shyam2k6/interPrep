import { useState } from "react";

function StudySessionForm({ goals, onSubmit }) {
  const [goal, setGoal] = useState("");
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!goal || !duration) return;

    onSubmit({
      goal,
      duration: Number(duration),
      notes,
    });

    setGoal("");
    setDuration("");
    setNotes("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900">
        Log Study Session
      </h3>

      {/* Goal */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Goal
        </label>

        <select
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-900"
        >
          <option value="">Select a Goal</option>

          {goals.map((goal) => (
            <option key={goal._id} value={goal._id}>
              {goal.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Duration (minutes)
        </label>

        <input
          type="number"
          min="1"
          placeholder="e.g. 90"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-900"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Notes
        </label>

        <textarea
          rows={4}
          placeholder="What did you study today?"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-900"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-full bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
      >
        Log Study Session
      </button>
    </form>
  );
}

export default StudySessionForm;
