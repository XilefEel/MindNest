import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import WelcomePage from "../pages/Welcome";
import LoginPage from "../pages/Login";
import SignupPage from "../pages/Signup";
import DashboardPage from "../pages/Dashboard";
import ProtectedRoute from "./ProtectedRoutes";
import NestDashboard from "@/pages/NestDashboard";

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  return (
    <Routes>
      <Route
        path="/"
        element={user ? <Navigate to="/dashboard" /> : <WelcomePage />}
      />
      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" /> : <LoginPage />}
      />
      <Route
        path="/signup"
        element={user ? <Navigate to="/dashboard" /> : <SignupPage />}
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
            <NestDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
