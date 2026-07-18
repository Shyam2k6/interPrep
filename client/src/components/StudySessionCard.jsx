import { useState } from "react";

function StudySessionCard({ session, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [duration, setDuration] = useState(session.duration);
  const [notes, setNotes] = useState(session.notes || "");

  const formattedDate = new Date(session.studiedAt).toLocaleDateString(
    "en-US",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  );

  const handleSave = async () => {
    await onUpdate(session._id, {
      duration: Number(duration),
      notes,
    });

    setIsEditing(false);
  };

  const handleCancel = () => {
    setDuration(session.duration);
    setNotes(session.notes || "");
    setIsEditing(false);
  };

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
          <p className="text-sm font-medium text-slate-900">{formattedDate}</p>
        </div>
      </div>

      {isEditing ? (
        <div className="mt-5 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Duration (minutes)
            </label>

            <input
              type="number"
              min="1"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-slate-900"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Notes
            </label>

            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-slate-900"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
            >
              Save
            </button>

            <button
              onClick={handleCancel}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="mt-5 rounded-2xl bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-900">
              Duration: {session.duration} mins
            </p>

            <p className="mt-3 text-sm text-slate-700">
              {session.notes || "No notes added."}
            </p>
          </div>

          <div className="mt-5 flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Edit
            </button>

            <button
              onClick={() => onDelete(session._id)}
              className="rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default StudySessionCard;
