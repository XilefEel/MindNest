import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoginPage from "../pages/Login";
import SignupPage from "../pages/Signup";
import DashboardPage from "../pages/UserDashboard";
import ProtectedRoute from "./ProtectedRoutes";
import NestDashboard from "@/pages/NestDashboard";
import BackgroundMusicPlayer from "@/components/BackgroundMusicPlayer";
import LoadingScreen from "@/components/LoadingScreen";

export default function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={user ? "/dashboard" : "/login"} replace />}
      />
      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />
      <Route
        path="/signup"
        element={user ? <Navigate to="/dashboard" replace /> : <SignupPage />}
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/nest/:id"
        element={
          <ProtectedRoute>
            <BackgroundMusicPlayer />
            <NestDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
