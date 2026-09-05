import {
  BookOpen,
  Settings,
  CircleUserRound,
  LayoutDashboard,
  Share2,
  Compass,
} from "lucide-react";
import SidebarItem from "./SidebarItem";
import { cn } from "@/lib/utils/general";
import { useSettingsModal } from "@/stores/useModalStore";

export default function Sidebar({
  activeSection,
  setActiveSection,
}: {
  activeSection: string;
  setActiveSection: (section: any) => void;
}) {
  const { setIsSettingsOpen } = useSettingsModal();

  return (
    <aside
      className={cn(
        "flex h-screen flex-col px-4 py-6",
        "bg-white dark:bg-zinc-800 md:dark:bg-zinc-800/50",
        "border-r border-zinc-100 dark:border-zinc-700",
      )}
    >
      <div className="mb-5 px-2 text-2xl font-bold whitespace-nowrap">
        🧠 MindNest
      </div>

      <nav className="flex flex-col gap-1.5">
        <SidebarItem
          Icon={LayoutDashboard}
          label="Dashboard"
          active={activeSection === "home"}
          handleClick={() => setActiveSection("home")}
        />

        <SidebarItem
          Icon={BookOpen}
          label="My Nests"
          active={activeSection === "nests"}
          handleClick={() => setActiveSection("nests")}
        />

        <SidebarItem
          Icon={Share2}
          label="Shared"
          active={activeSection === "shared"}
          handleClick={() => setActiveSection("shared")}
        />

        <SidebarItem
          Icon={Compass}
          label="Discover Nests"
          active={activeSection === "explore"}
          handleClick={() => setActiveSection("explore")}
        />
      </nav>

      <div className="mt-auto flex flex-col gap-1.5 border-t border-zinc-300 pt-4 dark:border-zinc-600">
        <SidebarItem
          Icon={CircleUserRound}
          label="Profile"
          active={activeSection === "profile"}
          handleClick={() => {}}
        />

        <SidebarItem
          Icon={Settings}
          label="Settings"
          handleClick={() => setIsSettingsOpen(true)}
        />
      </div>
    </aside>
  );
}
