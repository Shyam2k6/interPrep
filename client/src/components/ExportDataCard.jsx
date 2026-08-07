import { useState } from "react";
import { getGoals } from "../services/goalService";
import { getStudySessions } from "../services/studySessionService";
import { getRoadmaps } from "../services/roadmapService";
import { exportGoalsCsv, exportSessionsCsv, exportRoadmapsCsv } from "../utils/exportCsv";
import { exportToPdfReport } from "../utils/exportPdf";

function ExportDataCard({ token, user }) {
  const [loadingType, setLoadingType] = useState(null); // 'csv-goals', 'csv-sessions', 'csv-roadmaps', 'pdf-report', or null

  const handleExportGoals = async () => {
    setLoadingType("csv-goals");
    try {
      const res = await getGoals(token);
      const goals = res.data.goal || [];
      exportGoalsCsv(goals);
    } catch (err) {
      console.error(err);
      alert("Failed to export goals.");
    } finally {
      setLoadingType(null);
    }
  };

  const handleExportSessions = async () => {
    setLoadingType("csv-sessions");
    try {
      const res = await getStudySessions(token);
      const sessions = res.data.studySessions || [];
      exportSessionsCsv(sessions);
    } catch (err) {
      console.error(err);
      alert("Failed to export study sessions.");
    } finally {
      setLoadingType(null);
    }
  };

  const handleExportRoadmaps = async () => {
    setLoadingType("csv-roadmaps");
    try {
      const res = await getRoadmaps(token);
      const roadmaps = res.data.roadmaps || [];
      exportRoadmapsCsv(roadmaps);
    } catch (err) {
      console.error(err);
      alert("Failed to export roadmaps.");
    } finally {
      setLoadingType(null);
    }
  };

  const handleExportPdfReport = async () => {
    setLoadingType("pdf-report");
    try {
      // Fetch all three datasets in parallel for complete PDF summary
      const [goalsRes, sessionsRes, roadmapsRes] = await Promise.all([
        getGoals(token),
        getStudySessions(token),
        getRoadmaps(token),
      ]);

      const goals = goalsRes.data.goal || [];
      const sessions = sessionsRes.data.studySessions || [];
      const roadmaps = roadmapsRes.data.roadmaps || [];

      exportToPdfReport(user, goals, sessions, roadmaps);
    } catch (err) {
      console.error(err);
      alert("Failed to generate PDF workspace report.");
    } finally {
      setLoadingType(null);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between transition hover:shadow-md">
      <div>
        <span className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
          Data Portability
        </span>
        <h3 className="text-xl font-bold text-slate-900 mt-2">Export Study Data</h3>
        <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
          Download reports of your learning progress, logged sessions, and structured roadmaps for your portfolio.
        </p>
      </div>

      <div className="mt-6 space-y-3.5">
        {/* PDF Option */}
        <button
          onClick={handleExportPdfReport}
          disabled={loadingType !== null}
          className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 transition py-3 text-sm font-semibold cursor-pointer active:scale-98 disabled:opacity-50"
        >
          <span>📄</span>
          {loadingType === "pdf-report" ? "Compiling PDF..." : "Generate PDF Workspace Report"}
        </button>

        {/* CSV options grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1.5">
          <button
            onClick={handleExportGoals}
            disabled={loadingType !== null}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <span>🎯</span>
            {loadingType === "csv-goals" ? "Preparing..." : "Goals CSV"}
          </button>

          <button
            onClick={handleExportSessions}
            disabled={loadingType !== null}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <span>⏰</span>
            {loadingType === "csv-sessions" ? "Preparing..." : "Sessions CSV"}
          </button>

          <button
            onClick={handleExportRoadmaps}
            disabled={loadingType !== null}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <span>🗺️</span>
            {loadingType === "csv-roadmaps" ? "Preparing..." : "Roadmaps CSV"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExportDataCard;
