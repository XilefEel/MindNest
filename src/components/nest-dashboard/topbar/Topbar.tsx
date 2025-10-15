import { Nest } from "@/lib/types/nest";
import { Button } from "../../ui/button";
import {
  Settings,
  Pencil,
  Link,
  ArrowLeft,
  CircleUserRound,
  Menu,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import SettingsModal from "../../modals/SettingsModal";
import { clearLastNestId } from "@/lib/storage/session";
import { cn } from "@/lib/utils/general";
import { useNestStore } from "@/stores/useNestStore";
import { useNestlingStore } from "@/stores/useNestlingStore";
import TopbarButton from "./TopbarButton";

export default function Topbar({
  nest,
  isSidebarOpen,
  setIsSidebarOpen,
}: {
  nest: Nest;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}) {
  const navigate = useNavigate();
  const { setActiveNestlingId } = useNestlingStore();
  const { activeBackgroundId, setActiveBackgroundId } = useNestStore();

  const handleExit = () => {
    navigate("/dashboard");
    clearLastNestId();
    setActiveBackgroundId(null);
    setActiveNestlingId(null);
  };
  return (
    <nav className="flex w-full items-center justify-between border-b p-2 pt-8 sm:p-4 sm:pt-10">
      <div
        className={cn(
          "flex items-center gap-3 p-1",
          activeBackgroundId &&
            "rounded-xl bg-white/30 backdrop-blur-sm dark:bg-black/30",
        )}
      >
        <TopbarButton action={handleExit} Icon={ArrowLeft} />

        <TopbarButton
          action={() => setIsSidebarOpen(!isSidebarOpen)}
          Icon={Menu}
          isHidden
        />

        <span className="text-xl font-bold tracking-tight sm:text-2xl">
          🐣 {nest.title}
        </span>

        <TopbarButton action={() => console.log("edit nest")} Icon={Pencil} />
      </div>
      <div
        className={cn(
          "flex items-center p-1 sm:gap-2",
          activeBackgroundId &&
            "rounded-xl bg-white/30 backdrop-blur-sm dark:bg-black/30",
        )}
      >
        <TopbarButton action={() => console.log("share nest")} Icon={Link} />

        <SettingsModal>
          <Button
            variant="ghost"
            className={cn(
              "cursor-pointer rounded-lg hover:bg-teal-100 hover:text-teal-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-teal-300",
              activeBackgroundId && "hover:bg-white/20 dark:hover:bg-black/20",
            )}
            onDoubleClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Settings className="size-4 sm:size-5" />
          </Button>
        </SettingsModal>

        <TopbarButton
          action={() => console.log("profile")}
          Icon={CircleUserRound}
        />
      </div>
    </nav>
  );
}
