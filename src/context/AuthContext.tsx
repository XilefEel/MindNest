import { createContext, useContext, useState, useEffect } from "react";
import {
  getUserSession,
  clearUserSession,
  saveUserSession,
  getLastNestId,
} from "../lib/session";
import { User } from "@/lib/types";
import { useNavigate } from "react-router-dom";

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
  const [user, setUser] = useState<User | null>(null); // Holds the current user
  const [loading, setLoading] = useState(true); // Indicates loading state
  const navigate = useNavigate(); // Navigation hook

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
    const fetchUserSession = async () => {
      const userSession = await getUserSession();
      const lastNestId = await getLastNestId();

      if (userSession) {
        setUser(userSession);
        // Navigate to last opened nest, or dashboard
        if (lastNestId) {
          navigate(`/nest/${lastNestId}`);
        } else {
          navigate("/dashboard");
        }
      }

      setLoading(false);
    };

    fetchUserSession();
  }, []);

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
