import {
  BookOpen,
  Settings,
  LogOut,
  CircleUserRound,
  LayoutDashboard,
  Share2,
  Compass,
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
    <aside
      className={cn(
        "flex h-screen flex-col px-4 py-6",
        "bg-white dark:bg-zinc-800 md:dark:bg-zinc-800/50",
        "border-r border-gray-100 dark:border-zinc-700",
      )}
    >
      <div
        className={cn(
          "mb-5 px-2 text-2xl font-bold whitespace-nowrap transition-all duration-300",
          isCollapsed && "px-0 text-center",
        )}
      >
        {isCollapsed ? "🧠" : "🧠 MindNest"}
      </div>

      <nav className="flex flex-col gap-1.5">
        <SidebarItem
          Icon={LayoutDashboard}
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
          Icon={Share2}
          label="Shared"
          active={activeSection === "shared"}
          handleClick={() => setActiveSection("shared")}
          isCollapsed={isCollapsed}
        />

        <SidebarItem
          Icon={Compass}
          label="Discover Nests"
          active={activeSection === "explore"}
          handleClick={() => setActiveSection("explore")}
          isCollapsed={isCollapsed}
        />
      </nav>

      <div className="mt-auto flex flex-col gap-1.5 border-t border-gray-300 pt-4 dark:border-zinc-600">
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
