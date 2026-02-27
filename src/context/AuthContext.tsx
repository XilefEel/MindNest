import { createContext, useContext, useState, useEffect } from "react";
import {
  getUserSession,
  clearUserSession,
  saveUserSession,
} from "../lib/storage/user";
import { User } from "@/lib/types/user";
import LoadingScreen from "@/components/LoadingScreen";
import { toast } from "@/lib/utils/toast";

type AuthContextType = {
  user: User | null;
  login: (user: User) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (user: User) => {
    try {
      await saveUserSession(user);
      setUser(user);
    } catch (error) {
      toast.error("Login failed.");
    }
  };

  const logout = async () => {
    try {
      await clearUserSession();
      setUser(null);
    } catch (error) {
      toast.error("Logout failed.");
    }
  };

  useEffect(() => {
    const restoreSession = async () => {
      const userSession = await getUserSession();
      if (userSession) setUser(userSession);
      setLoading(false);
    };

    restoreSession();
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
