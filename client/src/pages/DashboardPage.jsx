import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getDashboard } from "../services/dashboardService";

function DashboardPage() {
  const [stats, setStats] = useState(null);
  const { user, token, loading } = useAuth();

  useEffect(() => {
    if (!token) return;

    const fetchDashboard = async () => {
      try {
        const data = await getDashboard(token);

        console.log(data);

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
    <div className="stats">
      <h1>Welcome, {user?.name} 👋</h1>
      <p>{user?.email}</p>

      <hr />
      <h3>Total Goals</h3>
      <p>{stats.totalGoals}</p>

      <h3>Completed Goals</h3>
      <p>{stats.completedGoals}</p>

      <h3>Total Roadmaps</h3>
      <p>{stats.roadmaps}</p>

      <h3>Average Progress</h3>
      <p>{stats.averageProgress}%</p>
    </div>
  );
}

export default DashboardPage;
