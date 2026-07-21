function WeeklyActivity({ activity }) {
  const maxMinutes = Math.max(...activity.map((item) => item.minutes), 1);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">Weekly Activity</h2>

      <div className="mt-6 space-y-4">
        {activity.map((item) => (
          <div key={item.day} className="flex items-center gap-4">
            <p className="w-10 text-sm font-medium">{item.day}</p>

            <div className="h-3 flex-1 rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-slate-900 transition-all duration-500"
                style={{
                  width: `${(item.minutes / maxMinutes) * 100}%`,
                }}
              />
            </div>

            <p className="w-20 text-right text-sm text-slate-600">
              {item.minutes} min
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeeklyActivity;
