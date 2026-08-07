import { useState } from "react";
import { Link } from "react-router-dom";

function StudySessionForm({ goals = [], roadmaps = [], onSubmit }) {
  const [goal, setGoal] = useState("");
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");

  const isGoalLinkedToRoadmap = goal
    ? roadmaps.some((r) => r.goal && (r.goal._id === goal || r.goal === goal))
    : false;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isGoalLinkedToRoadmap) return;
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
          onChange={(e) => {
            setGoal(e.target.value);
            if (roadmaps.some((r) => r.goal && (r.goal._id === e.target.value || r.goal === e.target.value))) {
              setDuration("");
            }
          }}
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
          placeholder={isGoalLinkedToRoadmap ? "Duration tracked via roadmap timer" : "e.g. 90"}
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          disabled={isGoalLinkedToRoadmap}
          className={`w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-900 ${isGoalLinkedToRoadmap ? "opacity-50 cursor-not-allowed" : ""}`}
        />
      </div>

      {isGoalLinkedToRoadmap && (
        <div className="rounded-2xl border border-orange-200 bg-orange-50/50 p-4 text-xs text-orange-800 leading-relaxed space-y-1.5 animate-fadeIn">
          <p className="font-bold flex items-center gap-1">
            ⚠️ Manual Logging Disabled
          </p>
          <p>
            This goal is linked to an active learning roadmap. To prevent timing inflation, you must accrue study minutes by studying resources using the <strong>Study Focus Timer</strong> directly on the Roadmaps page.
          </p>
          <Link
            to="/roadmaps"
            className="inline-block mt-1 font-semibold text-orange-650 hover:underline"
          >
            Go to Roadmaps Page &rarr;
          </Link>
        </div>
      )}

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
        disabled={isGoalLinkedToRoadmap || !goal || !duration}
        className="w-full rounded-full bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Log Study Session
      </button>
    </form>
  );
}

export default StudySessionForm;
