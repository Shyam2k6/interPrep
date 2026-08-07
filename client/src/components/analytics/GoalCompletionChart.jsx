function GoalCompletionChart({ total = 0, completed = 0 }) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  // SVG properties for the donut circle
  const radius = 50;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="rounded-3xl border border-[#eef0f2] bg-white p-6 shadow-sm flex flex-col justify-between h-[360px] transition hover:shadow-md">
      <div>
        <h3 className="text-lg font-bold text-zinc-950">Goal Completion</h3>
        <p className="text-xs text-zinc-400 mt-0.5">Overall goals completion rate</p>
      </div>

      <div className="relative flex items-center justify-center my-4">
        {/* SVG Circle Graph */}
        <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 120 120">
          <defs>
            <linearGradient id="completedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff7a59" /> {/* Coral-500 */}
              <stop offset="100%" stopColor="#e2583e" /> {/* Terracotta */}
            </linearGradient>
            <filter id="shadow">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.08" />
            </filter>
          </defs>

          {/* Underlay Track */}
          <circle
            className="text-zinc-100"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            r={radius}
            cx="60"
            cy="60"
          />

          {/* Overlay Progress Arc */}
          {total > 0 && (
            <circle
              stroke="url(#completedGrad)"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              r={radius}
              cx="60"
              cy="60"
              className="transition-all duration-1000 ease-out"
              style={{ filter: "url(#shadow)" }}
            />
          )}
        </svg>

        {/* Value Label in Center */}
        <div className="absolute text-center">
          <span className="text-3xl font-extrabold tracking-tight text-zinc-950">
            {percentage}%
          </span>
          <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mt-0.5">
            Done
          </span>
        </div>
      </div>

      {/* Details list */}
      <div className="grid grid-cols-2 gap-4 border-t border-[#eef0f2] pt-4">
        <div className="text-center">
          <span className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">Completed</span>
          <span className="text-lg font-bold text-[#e2583e] mt-0.5 block">{completed}</span>
        </div>
        <div className="text-center border-l border-[#eef0f2]">
          <span className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">Pending</span>
          <span className="text-lg font-bold text-zinc-700 mt-0.5 block">{total - completed}</span>
        </div>
      </div>
    </div>
  );
}

export default GoalCompletionChart;
