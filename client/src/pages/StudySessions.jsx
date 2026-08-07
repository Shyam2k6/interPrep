import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  deleteStudySession,
  getStudySessions,
  updateStudySession,
} from "../services/studySessionService";
import StudySessionCard from "../components/StudySessionCard";
import EmptyState from "../components/EmptyState";
import { CardSkeleton } from "../components/ui/Skeleton";

function StudySessions() {
  const [studySessions, setStudySessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const { token } = useAuth();

  useEffect(() => {
    const fetchStudySessions = async () => {
      try {
        setLoading(true);
        const data = await getStudySessions(token);
        setStudySessions(data.data.studySessions || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchStudySessions();
    }
  }, [token]);

  const handleUpdateSession = async (id, sessionData) => {
    try {
      const data = await updateStudySession(id, sessionData, token);

      setStudySessions((prev) =>
        prev.map((session) =>
          session._id === id ? data.data.studySession : session,
        ),
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteSession = async (id) => {
    try {
      await deleteStudySession(id, token);

      setStudySessions((prev) => prev.filter((session) => session._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <header className="rounded-3xl bg-[#e2583e] p-6 shadow-lg shadow-orange-500/10 text-white border-none">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/85">
          Study Sessions
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white">
          Study History
        </h1>
        <p className="mt-2 text-sm text-white/90">
          Review your tracked study milestones and progress logs.
        </p>
      </header>

      <div className="max-w-4xl mx-auto space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">
          Recent Study Sessions
        </h2>

        {loading ? (
          <div className="space-y-4">
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : studySessions.length === 0 ? (
          <EmptyState
            title="No study sessions logged"
            description="To log a study session and track your minutes automatically, go to the Roadmaps page, expand a milestone, and click 'Start Study Focus Timer'."
            icon="sessions"
          />
        ) : (
          studySessions.map((session) => (
            <StudySessionCard
              key={session._id}
              session={session}
              onDelete={handleDeleteSession}
              onUpdate={handleUpdateSession}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default StudySessions;
