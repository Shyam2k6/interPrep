import { getDeadlineStatus } from "../utils/getDeadlineStatus";

function GoalCard({ goal, onDelete, onUpdate }) {
  const progress = goal.progress || 0;
  const status = goal.status || "pending";

  const formattedDeadline = goal.deadline
    ? new Date(goal.deadline).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  const deadlineStatus = getDeadlineStatus(goal);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{goal.title}</h3>
          <p className="mt-1 text-sm text-slate-500">
            📅 {formattedDeadline ? `Due: ${formattedDeadline}` : "No deadline"}
          </p>
          <span className="mt-2 inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
            {goal.category}
          </span>
          {deadlineStatus && (
            <span
              className={`mt-2 ml-2 inline-block rounded-full px-3 py-1 text-xs font-medium
      ${
        deadlineStatus === "overdue"
          ? "bg-red-100 text-red-700"
          : deadlineStatus === "today"
            ? "bg-yellow-100 text-yellow-700"
            : deadlineStatus === "upcoming"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-blue-100 text-blue-700"
      }`}
            >
              {deadlineStatus === "overdue" && "🔴 Overdue"}

              {deadlineStatus === "today" && "🟡 Due Today"}

              {deadlineStatus === "upcoming" && "🟢 Upcoming"}

              {deadlineStatus === "completed" && "🔵 Completed"}
            </span>
          )}
          <p className="mt-2 text-sm text-slate-500">
            Keep momentum by checking in regularly.
          </p>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${status === "completed" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"}`}
        >
          {status}
        </span>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
          <span>Progress</span>
          <strong className="text-slate-900">{progress}%</strong>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-slate-900 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-5 flex gap-2">
        <button
          type="button"
          onClick={() => onUpdate(goal._id)}
          className="rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Complete
        </button>
        <button
          type="button"
          onClick={() => onDelete(goal._id)}
          className="rounded-full border border-rose-200 px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default GoalCard;
