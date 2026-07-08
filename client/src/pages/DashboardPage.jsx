import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getDashboard } from "../services/dashboardService";
import StatCard from "../components/StatCard";

function DashboardPage() {
  const [stats, setStats] = useState(null);
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
    <div className="space-y-6">
      <header className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
            Overview
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            Welcome back, {user?.name}
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Keep learning. Keep building. Your plan stays clear and focused.
          </p>
        </div>
        <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
          Weekly focus
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Goals" value={stats.totalGoals} />
        <StatCard title="Completed Goals" value={stats.completedGoals} />
        <StatCard title="Roadmaps" value={stats.roadmaps} />
        <StatCard
          title="Average Progress"
          value={`${stats.averageProgress}%`}
        />
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
          Momentum
        </p>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              You are making steady progress.
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              A clean plan and a few focused sessions are enough to move
              forward.
            </p>
          </div>
          <div className="rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">
            {stats.completedGoals}/{stats.totalGoals} goals completed
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
