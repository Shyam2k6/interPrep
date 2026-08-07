/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { getDeadlineStatus } from "../utils/getDeadlineStatus";

function GoalCard({ goal, onDelete, onUpdate }) {
  const progress = goal.progress || 0;
  const status = goal.status || "pending";
  const [localProgress, setLocalProgress] = useState(progress);

  // Keep local progress in sync with parent updates
  useEffect(() => {
    setLocalProgress(progress);
  }, [progress]);

  const formattedDeadline = goal.deadline
    ? new Date(goal.deadline).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
    : null;

  const deadlineStatus = getDeadlineStatus(goal);

  const handleSliderChange = (e) => {
    setLocalProgress(Number(e.target.value));
  };

  const handleSliderRelease = () => {
    if (localProgress === progress) return;
    let newStatus = "pending";
    if (localProgress === 100) newStatus = "completed";
    else if (localProgress > 0) newStatus = "in-progress";

    onUpdate(goal._id, { progress: localProgress, status: newStatus });
  };

  const handleIncrement = () => {
    const nextVal = Math.min(progress + 10, 100);
    let newStatus = "pending";
    if (nextVal === 100) newStatus = "completed";
    else if (nextVal > 0) newStatus = "in-progress";
    onUpdate(goal._id, { progress: nextVal, status: newStatus });
  };

  const handleDecrement = () => {
    const nextVal = Math.max(progress - 10, 0);
    let newStatus = "pending";
    if (nextVal === 100) newStatus = "completed";
    else if (nextVal > 0) newStatus = "in-progress";
    onUpdate(goal._id, { progress: nextVal, status: newStatus });
  };

  return (
    <div className="rounded-3xl border border-[#eef0f2] bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-zinc-950">{goal.title}</h3>
          <p className="mt-1 text-sm text-zinc-450 font-semibold">
            📅 {formattedDeadline ? `Due: ${formattedDeadline}` : "No deadline"}
          </p>
          <span className="mt-2.5 inline-block rounded-full bg-[#f8f9fa] border border-[#eef0f2] px-3.5 py-1 text-xs font-bold text-zinc-600">
            {goal.category}
          </span>
          {deadlineStatus && (
            <span
              className={`mt-2.5 ml-2 inline-block rounded-full px-3.5 py-1 text-xs font-bold
                ${deadlineStatus === "overdue"
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
          <p className="mt-3.5 text-sm text-zinc-400 font-semibold leading-relaxed">
            Keep momentum by checking in regularly.
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${status === "completed" ? "bg-emerald-150 text-[#e2583e] border border-orange-200/20" : "bg-[#f8f9fa] border border-[#eef0f2] text-zinc-600"
            }`}
        >
          {status}
        </span>
      </div>

      {/* Interactive Progress Area */}
      <div className="mt-5 space-y-3">
        <div className="mb-2 flex items-center justify-between text-sm text-zinc-500 font-bold">
          <span>Progress</span>
          <div className="flex items-center gap-2 font-extrabold text-zinc-950 bg-[#f8f9fa] rounded-xl px-2.5 py-1 border border-[#eef0f2]">
            <button
              onClick={handleDecrement}
              className="text-zinc-400 hover:text-[#e2583e] hover:bg-zinc-200/50 transition font-mono px-2 rounded cursor-pointer text-xs"
              title="Decrease by 10%"
            >
              -
            </button>
            <span className="min-w-8 text-center text-xs">{localProgress}%</span>
            <button
              onClick={handleIncrement}
              className="text-zinc-400 hover:text-[#e2583e] hover:bg-zinc-200/50 transition font-mono px-2 rounded cursor-pointer text-xs"
              title="Increase by 10%"
            >
              +
            </button>
          </div>
        </div>

        {/* Sliding Range Controller */}
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={localProgress}
          onChange={handleSliderChange}
          onMouseUp={handleSliderRelease}
          onTouchEnd={handleSliderRelease}
          className="w-full accent-[#e2583e] cursor-pointer h-2 rounded-lg appearance-none outline-none"
          style={{
            background: `linear-gradient(to right, #e2583e 0%, #e2583e ${localProgress}%, #eef0f2 ${localProgress}%, #eef0f2 100%)`
          }}
        />
      </div>

      <div className="mt-6 flex gap-2">
        {status !== "completed" && (
          <button
            type="button"
            onClick={() => onUpdate(goal._id, { progress: 100, status: "completed" })}
            className="rounded-full bg-zinc-950 hover:bg-[#e2583e] px-4.5 py-2 text-sm font-bold text-white transition active:scale-95 cursor-pointer shadow-sm"
          >
            Mark Done
          </button>
        )}
        <button
          type="button"
          onClick={() => onDelete(goal._id)}
          className="rounded-full border border-rose-200 px-4.5 py-2 text-sm font-bold text-rose-600 transition hover:bg-rose-50 hover:border-rose-300 cursor-pointer"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default GoalCard;
