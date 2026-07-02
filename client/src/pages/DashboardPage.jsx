import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getDashboard } from "../services/dashboardService";
import StatCard from "../components/StatCard";
import "../styles/DashboardPage.css";

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

  if (loading) return <h1>Loading...</h1>;
  if (!stats) return <h2>Loading...</h2>;

  return (
    <div className="dashboard">
      <h1>Welcome, {user?.name} 👋</h1>

      <p>{user?.email}</p>

      <div className="stats-grid">
        <StatCard title="Total Goals" value={stats.totalGoals} />

        <StatCard title="Completed Goals" value={stats.completedGoals} />

        <StatCard title="Roadmaps" value={stats.roadmaps} />

        <StatCard
          title="Average Progress"
          value={`${stats.averageProgress}%`}
        />
      </div>
    </div>
  );
}

export default DashboardPage;
