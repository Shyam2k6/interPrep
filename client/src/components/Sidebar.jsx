import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar">
      <h2>InterPrep</h2>

      <div className="user-info">
        <h3>{user?.name}</h3>
        <p>{user?.email}</p>
      </div>

      <nav>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/goals">Goals</Link>
        <Link to="/roadmaps">Roadmaps</Link>
      </nav>

      <button onClick={logout}>Logout</button>
    </aside>
  );
}

export default Sidebar;
