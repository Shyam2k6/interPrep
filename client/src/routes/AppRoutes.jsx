import { Routes, Route } from "react-router-dom";

import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import PublicLayout from "../layouts/PublicLayout";
import DashboardPage from "../pages/DashboardPage";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import PublicRoute from "../components/PublicRoute";
import GoalsPage from "../pages/GoalsPage";
import RoadmapsPage from "../pages/RoadmapsPage";
import StudySessions from "../pages/StudySessions";
import AIStudyCoach from "../pages/AIStudyCoach";
import AIRoadmapGenerator from "../pages/AIRoadmapGenerator";

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
          <PublicRoute>
            <PublicLayout>
              <LoginPage />
            </PublicLayout>
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <PublicLayout>
              <RegisterPage />
            </PublicLayout>
          </PublicRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <DashboardPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/goals"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <GoalsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/roadmaps"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <RoadmapsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/study-session"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <StudySessions />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai-coach"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <AIStudyCoach />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai-roadmap"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <AIRoadmapGenerator />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
