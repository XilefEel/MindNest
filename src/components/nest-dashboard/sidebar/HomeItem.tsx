import { clearLastNestling } from "@/lib/storage/nestling";
import { cn } from "@/lib/utils/general";
import {
  useActiveNestlingId,
  useNestlingActions,
} from "@/stores/useNestlingStore";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import { Home } from "lucide-react";

export default function HomeItem({
  nestId,
  setIsSidebarOpen,
}: {
  nestId: number;
  setIsSidebarOpen: (isOpen: boolean) => void;
}) {
  const { setActiveNestlingId, setActiveFolderId } = useNestlingActions();

  const activeNestlingId = useActiveNestlingId();
  const activeBackgroundId = useActiveBackgroundId();

  const handleHomeClick = async () => {
    setActiveNestlingId(null);
    setActiveFolderId(null);
    setIsSidebarOpen(false);
    await clearLastNestling(nestId);
  };
  return (
    <div
      onClick={handleHomeClick}
      onDoubleClick={(e) => e.stopPropagation()}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      className={cn(
        "flex items-center gap-2 rounded px-2 py-1 transition-[background,scale] active:scale-[0.98]",
        activeBackgroundId
          ? activeNestlingId === null
            ? "bg-white/30 font-semibold dark:bg-black/30"
            : "hover:bg-black/5 dark:hover:bg-white/5"
          : activeNestlingId === null
            ? "bg-teal-50 font-semibold text-teal-600 dark:bg-teal-500/10 dark:text-teal-400"
            : "hover:bg-gray-50 dark:hover:bg-zinc-700/50",
      )}
    >
      <div className="rounded-lg bg-linear-to-r from-teal-500 to-teal-600 p-1.5 text-white">
        <Home className="size-4 flex-shrink-0" />
      </div>
      <span>Home</span>
    </div>
  );
}
