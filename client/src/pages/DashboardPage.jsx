import { useAuth } from "../hooks/useAuth";

function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading) return <h1>Loading...</h1>;

  return (
    <>
      <h1>Dashboard</h1>

      <h2>Welcome {user?.name}</h2>

      <p>{user?.email}</p>
    </>
  );
}

export default DashboardPage;
