function Heatmap({ heatmap }) {
  const getColor = (minutes) => {
    if (minutes === 0) return "bg-slate-100";
    if (minutes <= 30) return "bg-green-200";
    if (minutes <= 60) return "bg-green-400";
    if (minutes <= 120) return "bg-green-600";
    return "bg-green-800";
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">Study Heatmap</h2>

      <p className="mt-1 text-sm text-slate-500">
        Your study consistency this month.
      </p>

      <div className="grid w-fit grid-flow-col grid-rows-7 gap-1">
        {heatmap.map((day) => (
          <div
            key={day.date}
            className={`h-4 w-4 rounded ${getColor(day.minutes)}`}
          />
        ))}
      </div>
    </div>
  );
}

export default Heatmap;
