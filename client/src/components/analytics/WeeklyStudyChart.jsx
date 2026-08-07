import { useState } from "react";

function WeeklyStudyChart({ activity = [] }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, minutes: 0 });

  // Default values if data is empty or loading
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const chartData = days.map((dayName) => {
    const matched = activity.find((item) => item.day === dayName);
    return {
      day: dayName,
      minutes: matched ? matched.minutes : 0,
    };
  });

  const maxMinutes = Math.max(...chartData.map((d) => d.minutes), 30); // Use 30 min minimum cap for scaling height

  // SVG Dimension configs
  const width = 500;
  const height = 220;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 30; // increased from 20 to give room for tooltips
  const paddingBottom = 30;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  const barSpacing = chartWidth / chartData.length;
  const barWidth = Math.max(barSpacing * 0.45, 16);

  return (
    <div className="rounded-3xl border border-[#eef0f2] bg-white p-6 shadow-sm flex flex-col justify-between h-[360px] transition hover:shadow-md">
      <div>
        <h3 className="text-lg font-bold text-zinc-950">Weekly Activity</h3>
        <p className="text-xs text-zinc-400 mt-0.5">Study duration by weekday</p>
      </div>

      <div className="relative my-4 flex-1 flex items-center justify-center">
        {/* SVG Drawing Canvas */}
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full max-h-[220px]"
        >
          <defs>
            <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0f0f11" stopOpacity="1" />
              <stop offset="100%" stopColor="#242427" stopOpacity="0.85" />
            </linearGradient>
            <linearGradient id="barGradHover" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff7a59" stopOpacity="1" />
              <stop offset="100%" stopColor="#e2583e" stopOpacity="0.9" />
            </linearGradient>
          </defs>

          {/* Grid lines (horizontal) */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
            const y = paddingTop + chartHeight * (1 - ratio);
            const val = Math.round(maxMinutes * ratio);
            return (
              <g key={index} className="opacity-60">
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="#eef0f2"
                  strokeWidth="1"
                  strokeDasharray="4,4"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-zinc-400 font-medium text-[10px] sm:text-xs"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Bars representation */}
          {chartData.map((item, index) => {
            const x = paddingLeft + index * barSpacing + (barSpacing - barWidth) / 2;
            const barHeight = (item.minutes / maxMinutes) * chartHeight;
            const y = paddingTop + chartHeight - barHeight;

            const isHovered = hoveredIndex === index;

            return (
              <g
                key={item.day}
                onMouseEnter={(e) => {
                  setHoveredIndex(index);
                  const container = e.currentTarget.closest(".relative");
                  const containerRect = container.getBoundingClientRect();
                  const svgEl = container.querySelector("svg");
                  const svgRect = svgEl.getBoundingClientRect();

                  const targetX = x + barWidth / 2;
                  const targetY = y;

                  const screenX = svgRect.left - containerRect.left + (targetX / width) * svgRect.width;
                  const screenY = svgRect.top - containerRect.top + (targetY / height) * svgRect.height;

                  setTooltip({
                    show: true,
                    x: screenX,
                    y: screenY - 8,
                    minutes: item.minutes,
                  });
                }}
                onMouseLeave={() => {
                  setHoveredIndex(null);
                  setTooltip({ show: false, x: 0, y: 0, minutes: 0 });
                }}
                className="cursor-pointer"
              >
                {/* Invisible hover-extender background bar for easier hovering */}
                <rect
                  x={paddingLeft + index * barSpacing}
                  y={paddingTop - 10}
                  width={barSpacing}
                  height={chartHeight + 20}
                  fill="transparent"
                />

                {/* Visual Bar rectangle with rounded tops */}
                <path
                  d={`
                    M ${x},${y + 6}
                    a 6,6 0 0,1 6,-6
                    h ${barWidth - 12}
                    a 6,6 0 0,1 6,6
                    v ${barHeight - 6 > 0 ? barHeight - 6 : 0}
                    h -${barWidth}
                    Z
                  `}
                  fill={isHovered ? "url(#barGradHover)" : "url(#barGrad)"}
                  className="transition-all duration-300 ease-in-out"
                />

                {/* X-axis labels */}
                <text
                  x={x + barWidth / 2}
                  y={height - paddingBottom + 18}
                  textAnchor="middle"
                  className={`text-[10px] font-bold tracking-wider ${isHovered ? "fill-[#e2583e] font-extrabold" : "fill-zinc-400"
                    }`}
                >
                  {item.day}
                </text>
              </g>
            );
          })}
        </svg>

        {/* HTML Tooltip styled with absolute units (keeps sizing independent of SVG scaling) */}
        {tooltip.show && (
          <div
            className="absolute z-50 rounded-xl bg-zinc-950 px-3 py-1.5 text-xs font-bold text-white shadow-2xl border border-zinc-800 pointer-events-none transform -translate-x-1/2 -translate-y-full whitespace-nowrap transition-all duration-75"
            style={{
              left: `${tooltip.x}px`,
              top: `${tooltip.y}px`,
            }}
          >
            {tooltip.minutes} mins
          </div>
        )}
      </div>

      <div className="text-xs font-semibold text-zinc-400 border-t border-[#eef0f2] pt-4 flex items-center justify-between">
        <span>Active study days: </span>
        <span className="font-bold text-zinc-950">
          {chartData.filter((d) => d.minutes > 0).length} / 7 days
        </span>
      </div>
    </div>
  );
}

export default WeeklyStudyChart;
