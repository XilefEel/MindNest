import { Routes, Route, Navigate } from "react-router-dom";
import DashboardPage from "../pages/UserDashboard";
import NestDashboard from "@/pages/NestDashboard";
import BackgroundMusicPlayer from "@/components/BackgroundMusicPlayer";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route
        path="/nest/:id"
        element={
          <>
            <BackgroundMusicPlayer />
            <NestDashboard />
          </>
        }
      />
    </Routes>
  );
}
