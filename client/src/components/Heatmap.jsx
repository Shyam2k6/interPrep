import { useState } from "react";

function Heatmap({ heatmap = [] }) {
  const [hoveredDay, setHoveredDay] = useState(null);

  if (heatmap.length === 0) {
    return (
      <div className="rounded-3xl border border-[#eef0f2] bg-white p-6 shadow-sm flex items-center justify-center min-h-[160px]">
        <p className="text-zinc-400 text-sm">No study records logged yet.</p>
      </div>
    );
  }

  // 1. Pad the start of heatmap so the first day of grid aligns with its correct day of week (Sunday start)
  const firstDate = new Date(heatmap[0].date);
  const firstDayOfWeek = firstDate.getDay(); // 0 = Sunday, 1 = Monday, ...
  
  const paddedHeatmap = [
    ...Array.from({ length: firstDayOfWeek }, (_, i) => ({
      date: `pad-${i}`,
      minutes: -1, // placeholder identifier
    })),
    ...heatmap,
  ];

  // 2. Compute dynamic Month Labels over matching column offsets
  const monthLabels = [];
  let prevMonth = -1;
  paddedHeatmap.forEach((day, index) => {
    if (day.minutes === -1) return;
    const dateObj = new Date(day.date);
    const month = dateObj.getMonth();
    if (month !== prevMonth) {
      const colIndex = Math.floor(index / 7);
      // Prevent month labels overlapping if too close (under 3 columns apart)
      if (monthLabels.length === 0 || colIndex - monthLabels[monthLabels.length - 1].col > 3) {
        monthLabels.push({
          label: dateObj.toLocaleDateString("en-US", { month: "short" }),
          col: colIndex,
        });
      }
      prevMonth = month;
    }
  });

  // 3. Color scales using terracotta shades
  const getColorClass = (minutes) => {
    if (minutes === 0) return "bg-[#f4f5f6] border border-zinc-200/50 hover:border-[#e2583e]/30"; // empty
    if (minutes <= 15) return "bg-[#fdf3f0] border border-transparent"; // low activity
    if (minutes <= 45) return "bg-[#fbc4b7] border border-transparent"; // medium-low activity
    if (minutes <= 90) return "bg-[#f28f79] border border-transparent"; // medium-high activity
    return "bg-[#e2583e] border border-transparent"; // high activity
  };

  // Format tooltip text
  const getTooltipText = (day) => {
    const formattedDate = new Date(day.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    if (day.minutes === 0) {
      return `No study sessions on ${formattedDate}`;
    }
    return `${day.minutes} mins studied on ${formattedDate}`;
  };

  return (
    <div className="rounded-3xl border border-[#eef0f2] bg-white p-6 shadow-sm transition hover:shadow-md relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-zinc-950">Study Consistency</h2>
          <p className="mt-0.5 text-xs text-zinc-400">
            A full year look at your daily logged session distributions.
          </p>
        </div>
        
        {/* Color Legend keys */}
        <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-bold">
          <span>Less</span>
          <div className="h-3 w-3 rounded-[2.5px] bg-[#f4f5f6] border border-zinc-250" />
          <div className="h-3 w-3 rounded-[2.5px] bg-[#fdf3f0]" />
          <div className="h-3 w-3 rounded-[2.5px] bg-[#fbc4b7]" />
          <div className="h-3 w-3 rounded-[2.5px] bg-[#f28f79]" />
          <div className="h-3 w-3 rounded-[2.5px] bg-[#e2583e]" />
          <span>More</span>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto pb-2 scrollbar-thin select-none relative">
        <div className="min-w-[720px] relative">
          
          {/* Months Header Timeline */}
          <div className="flex text-[10px] text-zinc-400 font-semibold mb-1.5 h-4 relative">
            {monthLabels.map((ml, idx) => (
              <span
                key={idx}
                className="absolute transform -translate-x-1/2"
                style={{ left: `${ml.col * 12 + 28}px` }}
              >
                {ml.label}
              </span>
            ))}
          </div>

          {/* Core Grid Body with Left Labels */}
          <div className="flex items-start">
            
            {/* Weekday indicator labels */}
            <div className="flex flex-col justify-between text-[10px] text-zinc-400 font-semibold pr-2.5 h-[84px] py-1 text-right w-6 shrink-0">
              <span></span>
              <span>Mon</span>
              <span></span>
              <span>Wed</span>
              <span></span>
              <span>Fri</span>
              <span></span>
            </div>

            {/* Grid distribution blocks */}
            <div className="grid grid-flow-col grid-rows-7 gap-0.5 h-[84px]">
              {paddedHeatmap.map((day, idx) => {
                if (day.minutes === -1) {
                  return (
                    <div
                      key={`pad-${idx}`}
                      className="h-[10px] w-[10px] bg-transparent pointer-events-none"
                    />
                  );
                }

                const isHovered = hoveredDay === idx;

                return (
                  <div
                    key={day.date}
                    className={`h-[10px] w-[10px] rounded-[1.5px] cursor-pointer transition-all duration-200 ${getColorClass(
                      day.minutes,
                    )} ${isHovered ? "scale-125 z-10 shadow-sm" : ""}`}
                    onMouseEnter={() => setHoveredDay(idx)}
                    onMouseLeave={() => setHoveredDay(null)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Interactive Tooltip */}
      {hoveredDay !== null && paddedHeatmap[hoveredDay] && paddedHeatmap[hoveredDay].minutes !== -1 && (
        <div className="absolute z-20 rounded-xl bg-zinc-950 px-3 py-1.5 text-xs font-semibold text-white shadow-lg border border-zinc-800 pointer-events-none -mt-4 animate-fadeIn left-6">
          {getTooltipText(paddedHeatmap[hoveredDay])}
        </div>
      )}
    </div>
  );
}

export default Heatmap;
