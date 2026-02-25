import { cn } from "@/lib/utils/general";
import { Home } from "lucide-react";

export default function HomeItem({
  activeBackgroundId,
  activeNestlingId,
  handleHomeClick,
}: {
  activeBackgroundId: number | null;
  activeNestlingId: number | null;
  handleHomeClick: () => void;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded px-2 py-1 font-medium transition-[background]",
        activeBackgroundId
          ? activeNestlingId === null
            ? "bg-white/50 font-semibold dark:bg-black/50"
            : "hover:bg-white/20 dark:hover:bg-black/20"
          : activeNestlingId === null
            ? "bg-teal-100 font-semibold dark:bg-teal-400"
            : "hover:bg-gray-100 dark:hover:bg-gray-700",
      )}
      onClick={handleHomeClick}
      onDoubleClick={(e) => e.stopPropagation()}
    >
      <div className="rounded-lg bg-linear-to-r from-teal-500 to-teal-600 p-1.5 text-white">
        <Home className="size-4" />
      </div>
      <span>Home</span>
    </div>
  );
}
