function StudySessionCard({ session }) {
  const formattedDate = new Date(session.studiedAt).toLocaleDateString(
    "en-US",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  );

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            {session.goal.title}
          </h3>

          <span className="mt-2 inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
            {session.goal.category}
          </span>
        </div>

        <div className="text-right">
          <p className="text-sm font-medium text-slate-900">
            {session.duration} mins
          </p>

          <p className="mt-1 text-xs text-slate-500">{formattedDate}</p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl bg-slate-50 p-4">
        <p className="text-sm text-slate-700">
          {session.notes || "No notes added."}
        </p>
      </div>
    </div>
  );
}

export default StudySessionCard;
