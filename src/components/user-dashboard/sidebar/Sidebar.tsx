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
import { cn } from "@/lib/utils/general";
import { useSettingsModal } from "@/stores/useModalStore";

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
  const { setIsSettingsOpen } = useSettingsModal();

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
          "mb-6 overflow-hidden text-2xl font-bold whitespace-nowrap transition-all duration-300",
          isCollapsed && "text-center",
        )}
      >
        {isCollapsed ? "🧠" : "🧠 MindNest"}
      </div>

      <nav className="flex flex-col gap-2">
        <SidebarItem
          Icon={Home}
          label="Dashboard"
          active={activeSection === "home"}
          handleClick={() => setActiveSection("home")}
          isCollapsed={isCollapsed}
        />

        <SidebarItem
          Icon={BookOpen}
          label="My Nests"
          active={activeSection === "nests"}
          handleClick={() => setActiveSection("nests")}
          isCollapsed={isCollapsed}
        />

        <SidebarItem
          Icon={Clock}
          label="Shared"
          active={activeSection === "shared"}
          handleClick={() => setActiveSection("shared")}
          isCollapsed={isCollapsed}
        />

        <SidebarItem
          Icon={Search}
          label="Discover Nests"
          active={activeSection === "explore"}
          handleClick={() => setActiveSection("explore")}
          isCollapsed={isCollapsed}
        />
      </nav>

      <div className="mt-auto flex flex-col gap-2 border-t border-gray-200 pt-6">
        <SidebarItem
          Icon={CircleUserRound}
          label="Profile"
          active={activeSection === "profile"}
          handleClick={() => {}}
          isCollapsed={isCollapsed}
        />

        <SidebarItem
          Icon={Settings}
          label="Settings"
          isCollapsed={isCollapsed}
          handleClick={() => setIsSettingsOpen(true)}
        />

        <SidebarItem
          Icon={LogOut}
          label="Log Out"
          handleClick={handleLogOut}
          isCollapsed={isCollapsed}
        />
      </div>
    </aside>
  );
}
