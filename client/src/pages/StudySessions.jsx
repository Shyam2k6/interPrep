import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getGoals } from "../services/goalService";
import {
  createStudySession,
  deleteStudySession,
  getStudySessions,
  updateStudySession,
} from "../services/studySessionService";
import StudySessionForm from "../components/StudySessionForm";
import StudySessionCard from "../components/StudySessionCard";

function StudySessions() {
  const [goals, setGoals] = useState([]);
  const [studySessions, setStudySessions] = useState([]);

  const { token } = useAuth();

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const data = await getGoals(token);
        setGoals(data.data.goal);
      } catch (error) {
        console.log(error);
      }
    };

    fetchGoals();
  }, [token]);

  useEffect(() => {
    const fetchStudySessions = async () => {
      try {
        const data = await getStudySessions(token);
        setStudySessions(data.data.studySessions);
      } catch (error) {
        console.log(error);
      }
    };

    fetchStudySessions();
  }, [token]);

  const handleCreateSession = async (sessionData) => {
    try {
      const data = await createStudySession(sessionData, token);

      setStudySessions((prevSessions) => [
        data.data.studySession,
        ...prevSessions,
      ]);
    } catch (error) {
      console.log(error);
    }
  };

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
    <div className="space-y-6">
      <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
          Study Sessions
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
          Track your learning.
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          Record every study session and build consistent learning habits.
        </p>
      </header>

      <div className="grid gap-6 xl:grid-cols-[360px,minmax(0,1fr)]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <StudySessionForm goals={goals} onSubmit={handleCreateSession} />
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">
            Recent Study Sessions
          </h2>

          {studySessions.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600">
              No study sessions yet. Log your first study session.
            </div>
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
        </section>
      </div>
    </div>
  );
}

export default StudySessions;
