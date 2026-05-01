import { cn } from "@/lib/utils/general";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { Maximize, Minus, X } from "lucide-react";

export default function Titlebar() {
  const appWindow = getCurrentWindow();
  const activeBackgroundId = useActiveBackgroundId();

  return (
    <div
      data-tauri-drag-region
      className="fixed z-[100] flex h-6 w-full items-center justify-between dark:text-white"
    >
      <div
        className={cn(
          "ml-auto flex items-center",
          activeBackgroundId && "bg-white/30 backdrop-blur-sm dark:bg-black/30",
        )}
      >
        <div
          className={cn(
            "flex h-6 items-center justify-center px-4 transition-colors hover:bg-gray-200 dark:hover:bg-zinc-700",
            activeBackgroundId && "hover:bg-black/5 dark:hover:bg-white/5",
          )}
          onClick={() => appWindow.minimize()}
        >
          <Minus className="size-4 flex-shrink-0" />
        </div>

        <div
          className={cn(
            "flex h-6 items-center justify-center px-4 transition-colors hover:bg-gray-200 dark:hover:bg-zinc-700",
            activeBackgroundId && "hover:bg-black/5 dark:hover:bg-white/5",
          )}
          onClick={() => appWindow.toggleMaximize()}
        >
          <Maximize className="size-4 flex-shrink-0" />
        </div>

        <div
          className="flex h-6 items-center justify-center px-4 transition-colors hover:bg-red-500"
          onClick={() => appWindow.close()}
        >
          <X className="size-4 flex-shrink-0" />
        </div>
      </div>
    </div>
  );
}
