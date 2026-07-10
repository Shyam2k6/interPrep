function RoadmapCard({ roadmap, onToggleStep, onDelete }) {
  const steps = roadmap.steps || [];
  const progress = roadmap.progress || 0;
  const completedCount = steps.filter((step) => step.completed).length;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            {roadmap.title}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {completedCount}/{steps.length} steps completed
          </p>
        </div>
        <div className="text-sm font-semibold text-slate-900">{progress}%</div>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
          <span>Completion</span>
          <strong className="text-slate-900">{progress}%</strong>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-slate-900 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-5 space-y-2">
        {steps.map((step) => (
          <label
            key={step._id}
            className={`flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm ${step.completed ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-slate-50 text-slate-700"}`}
          >
            <input
              type="checkbox"
              checked={step.completed}
              onChange={() => onToggleStep(roadmap._id, step._id)}
              className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
            />
            <span>{step.title}</span>
          </label>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onDelete(roadmap._id)}
        className="mt-5 rounded-full border border-rose-200 px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
      >
        Delete roadmap
      </button>
    </div>
  );
}

export default RoadmapCard;
