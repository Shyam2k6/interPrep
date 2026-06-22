import { useAuth } from "../hooks/useAuth";

function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading) return <h1>Loading...</h1>;

  return (
    <>
      <h1>Welcome back, {user?.name} 👋</h1>

      <p>Ready to continue your learning journey?</p>
    </>
  );
}

export default DashboardPage;
