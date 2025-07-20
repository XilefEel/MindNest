import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

import { ReactNode } from "react";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) return <h1>loading</h1>;
  if (!user) return <Navigate to="/login" />;

  return children;
};

export default ProtectedRoute;
