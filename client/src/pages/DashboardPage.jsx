import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getDashboard } from "../services/dashboardService";
import StatCard from "../components/StatCard";
import {
  getHeatmap,
  // getStudySessionStats,
  getStudyStreak,
  getWeeklyActivity,
  getStudySessions,
} from "../services/studySessionService";
// import AnalyticsCard from "../components/AnalyticsCard";
import Heatmap from "../components/Heatmap";
import StudyTrendChart from "../components/analytics/StudyTrendChart";
import GoalCompletionChart from "../components/analytics/GoalCompletionChart";
import WeeklyStudyChart from "../components/analytics/WeeklyStudyChart";
import ExportDataCard from "../components/ExportDataCard";

function DashboardPage() {
  const [stats, setStats] = useState(null);
  // const [studyStats, setStudyStats] = useState(null);
  const [weeklyActivity, setWeeklyActivity] = useState([]);
  const [studyStreak, setStudyStreak] = useState(0);
  const [heatmap, setHeatmap] = useState([]);
  const [sessions, setSessions] = useState([]);
  const { user, token, loading } = useAuth();

  useEffect(() => {
    if (!token) return;

    const fetchDashboard = async () => {
      try {
        const data = await getDashboard(token);
        setStats(data.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDashboard();
  }, [token]);

  // useEffect(() => {
  //   if (!token) return;
  //   async function fetchSessionStats() {
  //     const data = await getStudySessionStats(token);
  //     setStudyStats(data.data);
  //   }
  //   fetchSessionStats();
  // }, [token]);

  useEffect(() => {
    if (!token) return;
    async function fetchWeeklyActivity() {
      const data = await getWeeklyActivity(token);
      setWeeklyActivity(data.data.weeklyActivity);
    }
    fetchWeeklyActivity();
  }, [token]);

  useEffect(() => {
    if (!token) return;
    async function fetchStudyStreak() {
      const streakData = await getStudyStreak(token);
      setStudyStreak(streakData.data.currentStreak);
    }
    fetchStudyStreak();
  }, [token]);

  useEffect(() => {
    if (!token) return;
    async function fetchHeatmap() {
      const heatmapData = await getHeatmap(token);
      setHeatmap(heatmapData.data.heatmap);
    }
    fetchHeatmap();
  }, [token]);

  useEffect(() => {
    if (!token) return;
    async function fetchSessions() {
      try {
        const data = await getStudySessions(token);
        setSessions(data.data.studySessions || []);
      } catch (error) {
        console.log(error);
      }
    }
    fetchSessions();
  }, [token]);

  if (loading)
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-600">
        Loading your overview…
      </div>
    );
  if (!stats)
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-600">
        Preparing your dashboard…
      </div>
    );

  return (
    <div className="space-y-6 animate-fadeIn">
      <header className="flex flex-col gap-4 rounded-3xl bg-[#e2583e] p-6 shadow-lg shadow-orange-500/10 sm:flex-row sm:items-end sm:justify-between text-white border-none">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/85">
            Overview
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white">
            Welcome back, {user?.name}
          </h1>
          <p className="mt-2 text-sm text-white/90">
            Keep learning. Keep building. Your plan stays clear and focused.
          </p>
        </div>
        <div className="rounded-full border border-white/25 bg-white/10 px-3.5 py-2 text-sm text-white font-bold w-fit">
          Weekly focus
        </div>
      </header>

      <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
        Overview
      </h2>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Goals" value={stats.totalGoals} />
        <StatCard title="Completed Goals" value={stats.completedGoals} />
        <StatCard title="Roadmaps" value={stats.roadmaps} />
        <StatCard
          title="Average Progress"
          value={`${stats.averageProgress}%`}
        />
      </div>

      {/* <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Learning Analytics
        </h2>

        {studyStats && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <AnalyticsCard
              title="Study Sessions"
              value={studyStats.totalSessions}
            />

            <AnalyticsCard
              title="Study Minutes"
              value={studyStats.totalStudyMinutes}
            />

            <AnalyticsCard
              title="Average Session"
              value={`${studyStats.averageSessionDuration} min`}
            />

            <AnalyticsCard
              title="Today's Study"
              value={`${studyStats.todayStudyMinutes} min`}
            />
          </div>
        )}
      </section> */}

      {/* Smart Analytics Charts Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Visual Insights
        </h2>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <StudyTrendChart sessions={sessions} />
          <GoalCompletionChart
            total={stats.totalGoals}
            completed={stats.completedGoals}
          />
          <WeeklyStudyChart activity={weeklyActivity} />
        </div>
      </section>

      <Heatmap heatmap={heatmap} />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between transition hover:shadow-md">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
              Momentum
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900">{`🔥 ${studyStreak} Days`}</h1>
            <h3 className="text-lg font-bold text-slate-800 mt-3">
              Keep your learning streak active.
            </h3>
            <p className="mt-1 text-sm text-slate-500 leading-relaxed">
              Log study sessions daily to maintain your momentum and build
              continuous learning habits.
            </p>
          </div>
          <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Goals Accomplished
            </span>
            <div className="rounded-full bg-emerald-50 border border-emerald-100 px-3.5 py-1.5 text-xs font-bold text-emerald-700">
              {stats.completedGoals} / {stats.totalGoals} Done
            </div>
          </div>
        </div>

        <ExportDataCard token={token} user={user} />
      </div>
    </div>
  );
}

export default DashboardPage;
