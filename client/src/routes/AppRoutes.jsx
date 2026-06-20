import { Routes, Route } from "react-router-dom";

import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import PublicLayout from "../layouts/PublicLayout";
import DashboardPage from "../pages/DashboardPage";

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicLayout>
            <HomePage />
          </PublicLayout>
        }
      />
      <Route
        path="/login"
        element={
          <PublicLayout>
            <LoginPage />
          </PublicLayout>
        }
      />
      <Route
        path="/register"
        element={
          <PublicLayout>
            <RegisterPage />
          </PublicLayout>
        }
      />
      <Route
        path="/dashboard"
        element={
          <PublicLayout>
            <DashboardPage />
          </PublicLayout>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
