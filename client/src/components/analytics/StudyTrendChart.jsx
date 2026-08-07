import { useState } from "react";

function StudyTrendChart({ sessions = [] }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, minutes: 0 });

  // Generate last 7 days (including today)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    return date;
  }).reverse();

  // Aggregate minutes by date
  const chartData = last7Days.map((dateObj) => {
    const dayStr = dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    const dailySessions = sessions.filter((s) => {
      const sessionDate = new Date(s.studiedAt);
      return (
        sessionDate.getFullYear() === dateObj.getFullYear() &&
        sessionDate.getMonth() === dateObj.getMonth() &&
        sessionDate.getDate() === dateObj.getDate()
      );
    });

    const totalMins = dailySessions.reduce((sum, s) => sum + s.duration, 0);

    return {
      date: dayStr,
      minutes: totalMins,
    };
  });

  const maxMinutes = Math.max(...chartData.map((d) => d.minutes), 30); // scale reference

  // SVG parameters
  const width = 500;
  const height = 220;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 30; // increased from 20 to give room for tooltips
  const paddingBottom = 30;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  const pointsSpacing = chartWidth / (chartData.length - 1 || 1);

  // Calculate coordinates for the line
  const points = chartData.map((d, index) => {
    const x = paddingLeft + index * pointsSpacing;
    const y = paddingTop + chartHeight - (d.minutes / maxMinutes) * chartHeight;
    return { x, y, minutes: d.minutes, date: d.date };
  });

  // Construct SVG paths
  let linePath = "";
  let areaPath = "";

  if (points.length > 0) {
    linePath = `M ${points[0].x} ${points[0].y} ` + points.slice(1).map((p) => `L ${p.x} ${p.y}`).join(" ");
    areaPath =
      `${linePath} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight
      } Z`;
  }

  return (
    <div className="rounded-3xl border border-[#eef0f2] bg-white p-6 shadow-sm flex flex-col justify-between h-[360px] transition hover:shadow-md md:col-span-2">
      <div>
        <h3 className="text-lg font-bold text-zinc-950">Study Trend</h3>
        <p className="text-xs text-zinc-400 mt-0.5">Daily study minutes over the last 7 days</p>
      </div>

      <div className="relative my-4 flex-1 flex items-center justify-center">
        {points.length > 0 ? (
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-full max-h-[220px]"
          >
            <defs>
              <linearGradient id="trendAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#e2583e" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#e2583e" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="trendLineGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#ff7a59" />
                <stop offset="100%" stopColor="#e2583e" />
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

            {/* Area Path under the line */}
            <path d={areaPath} fill="url(#trendAreaGrad)" />

            {/* Trend Line */}
            <path
              d={linePath}
              fill="none"
              stroke="url(#trendLineGrad)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Circular Point Markers */}
            {points.map((p, index) => {
              const isHovered = hoveredPoint === index;
              return (
                <g key={index}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isHovered ? 6 : 4}
                    fill={isHovered ? "#e2583e" : "#ffffff"}
                    stroke="#e2583e"
                    strokeWidth="2.5"
                    className="transition-all duration-200"
                  />

                  {/* X-axis date strings */}
                  {index % 2 === 0 && (
                    <text
                      x={p.x}
                      y={height - paddingBottom + 18}
                      textAnchor="middle"
                      className="fill-zinc-400 font-semibold text-[10px] sm:text-xs"
                    >
                      {p.date}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Invisible vertical hover zones for easier mouse interaction */}
            {points.map((p, index) => (
              <rect
                key={`hover-${index}`}
                x={p.x - pointsSpacing / 2}
                y={paddingTop - 10}
                width={pointsSpacing}
                height={chartHeight + 20}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={(e) => {
                  setHoveredPoint(index);
                  const container = e.currentTarget.closest(".relative");
                  const containerRect = container.getBoundingClientRect();
                  const svgEl = container.querySelector("svg");
                  const svgRect = svgEl.getBoundingClientRect();

                  const screenX = svgRect.left - containerRect.left + (p.x / width) * svgRect.width;
                  const screenY = svgRect.top - containerRect.top + (p.y / height) * svgRect.height;

                  setTooltip({
                    show: true,
                    x: screenX,
                    y: screenY - 8,
                    minutes: p.minutes,
                  });
                }}
                onMouseLeave={() => {
                  setHoveredPoint(null);
                  setTooltip({ show: false, x: 0, y: 0, minutes: 0 });
                }}
              />
            ))}
          </svg>
        ) : (
          <div className="text-zinc-400 text-sm">No recent data available.</div>
        )}

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

      <div className="text-xs font-semibold text-zinc-500 border-t border-[#eef0f2] pt-4 flex items-center justify-between">
        <span>Daily Avg: </span>
        <span className="font-bold text-zinc-950">
          {Math.round(chartData.reduce((sum, d) => sum + d.minutes, 0) / 7)} mins/day
        </span>
      </div>
    </div>
  );
}

export default StudyTrendChart;
