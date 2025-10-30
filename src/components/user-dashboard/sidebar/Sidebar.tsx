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
import SettingsModal from "../../modals/SettingsModal";
import { cn } from "@/lib/utils/general";

export default function Sidebar({
  activeSection,
  setActiveSection,
  isCollapsed = false,
}: {
  activeSection: string;
  setActiveSection: (section: any) => void;
  isCollapsed: boolean;
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
    <aside className="flex h-screen flex-col p-5">
      <div
        className={cn(
          "mb-6 overflow-hidden text-3xl font-bold whitespace-nowrap transition-all duration-300",
          isCollapsed && "text-center",
        )}
      >
        {isCollapsed ? "🧠" : "🧠 MindNest"}
      </div>

      <nav className="space-y-2">
        <SidebarItem
          icon={<Home />}
          label="Dashboard"
          active={activeSection === "home"}
          onClick={() => setActiveSection("home")}
          isCollapsed={isCollapsed}
        />
        <SidebarItem
          icon={<BookOpen />}
          label="My Nests"
          active={activeSection === "nests"}
          onClick={() => setActiveSection("nests")}
          isCollapsed={isCollapsed}
        />
        <SidebarItem
          icon={<Clock />}
          label="Shared"
          active={activeSection === "shared"}
          onClick={() => setActiveSection("shared")}
          isCollapsed={isCollapsed}
        />
        <SidebarItem
          icon={<Search />}
          label="Discover Nests"
          active={activeSection === "explore"}
          onClick={() => setActiveSection("explore")}
          isCollapsed={isCollapsed}
        />
      </nav>
      <div className="mt-auto border-t border-gray-200 pt-6">
        <SidebarItem
          icon={<CircleUserRound />}
          label="Profile"
          active={activeSection === "profile"}
          onClick={() => {}}
          isCollapsed={isCollapsed}
        />
        <SettingsModal>
          <SidebarItem
            icon={<Settings />}
            label="Settings"
            isCollapsed={isCollapsed}
          />
        </SettingsModal>

        <SidebarItem
          icon={<LogOut />}
          label="Log Out"
          onClick={handleLogOut}
          isCollapsed={isCollapsed}
        />
      </div>
    </aside>
  );
}
