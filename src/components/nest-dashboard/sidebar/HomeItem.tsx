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
        "flex cursor-pointer items-center gap-2 rounded px-2 py-1 font-medium transition-colors duration-150 ease-in-out",
        activeBackgroundId
          ? activeNestlingId === null
            ? "bg-white/50 font-bold dark:bg-black/50"
            : "hover:bg-white/20 dark:hover:bg-black/20"
          : activeNestlingId === null
            ? "bg-teal-100 font-bold dark:bg-teal-400"
            : "hover:bg-teal-50 dark:hover:bg-gray-700",
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
