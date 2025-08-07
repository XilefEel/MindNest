import { createContext, useContext, useState, useEffect } from "react";
import {
  getUserSession,
  clearUserSession,
  saveUserSession,
} from "../lib/session";
import { User } from "@/lib/types";
import LoadingScreen from "@/components/LoadingScreen";

// Define the shape of the auth context
type AuthContextType = {
  user: User | null; // Logged-in user info, or null if not logged in
  login: (user: User) => Promise<void>; // Logs in a user
  logout: () => Promise<void>; // Logs out the user
  loading: boolean; // Whether session is being restored on app load
};

// Create the actual context object
const AuthContext = createContext<AuthContextType | null>(null);

// Provider component that wraps the app and provides auth state
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Save user session and update state
  const login = async (user: User) => {
    try {
      await saveUserSession(user);
      setUser(user);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  // Clear session and reset user
  const logout = async () => {
    try {
      await clearUserSession();
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // On first load, restore session if available
  useEffect(() => {
    const restoreSession = async () => {
      const userSession = await getUserSession();
      if (userSession) setUser(userSession);
      setLoading(false);
    };

    restoreSession();
  }, []);

  if (loading) return <LoadingScreen />;

  // Provide auth state and actions to children
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
