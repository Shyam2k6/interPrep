import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function PublicRoute({ children }) {
  const { token, loading } = useAuth();

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (token) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}

export default PublicRoute;
