import {
  Home,
  BookOpen,
  Clock,
  Search,
  Settings,
  LogOut,
  CircleUserRound,
} from "lucide-react";
import SidebarItem from "./SidebarItem";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function Sidebar({
  activeSection,
  setActiveSection,
  setIsSettingsOpen,
}: {
  activeSection: string;
  setActiveSection: (section: any) => void;
  setIsSettingsOpen: (open: boolean) => void;
}) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleLogOut = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err: any) {
      throw new Error(err.message || "Logout failed");
    }
  };
  return (
    <aside className="h-screen p-5 flex flex-col">
      <div className="text-2xl font-bold mb-6">🧠 MindNest</div>

      <nav className="space-y-2">
        <SidebarItem
          icon={<Home />}
          label="Dashboard"
          active={activeSection === "home"}
          onClick={() => setActiveSection("home")}
        />
        <SidebarItem
          icon={<BookOpen />}
          label="My Nests"
          active={activeSection === "nests"}
          onClick={() => setActiveSection("nests")}
        />
        <SidebarItem
          icon={<Clock />}
          label="Shared"
          active={activeSection === "shared"}
          onClick={() => setActiveSection("shared")}
        />
        <SidebarItem
          icon={<Search />}
          label="Explore Nests"
          active={activeSection === "explore"}
          onClick={() => setActiveSection("explore")}
        />
      </nav>
      <div className="mt-auto pt-6 border-t border-gray-200">
        <SidebarItem
          icon={<CircleUserRound />}
          label="Profile"
          active={activeSection === "profile"}
          onClick={() => {}}
        />
        <SidebarItem
          icon={<Settings />}
          label="Settings"
          onClick={() => setIsSettingsOpen(true)}
        />
        <SidebarItem icon={<LogOut />} label="Log Out" onClick={handleLogOut} />
      </div>
    </aside>
  );
}
