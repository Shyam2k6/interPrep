function StatCard({ title, value }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <p className="text-sm text-slate-500">{title}</p>
      <h2 className="mt-3 text-3xl font-semibold text-slate-900">{value}</h2>
    </div>
  );
}

export default StatCard;
