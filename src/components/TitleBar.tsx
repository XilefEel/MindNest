import { cn } from "@/lib/utils/general";
import { useNestStore } from "@/stores/useNestStore";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { Maximize, Minus, X } from "lucide-react";

export default function Titlebar() {
  const appWindow = getCurrentWindow();
  const { activeBackgroundId } = useNestStore();
  return (
    <div
      data-tauri-drag-region
      className="fixed flex h-6 w-full items-center justify-between dark:text-white"
    >
      <div
        className={cn(
          "ml-auto flex items-center",
          activeBackgroundId && "bg-white/30 backdrop-blur-sm dark:bg-black/30",
        )}
      >
        <div
          className="flex h-6 cursor-pointer items-center justify-center px-4 transition-colors duration-200 hover:bg-gray-100 hover:dark:bg-zinc-700"
          onClick={() => appWindow.minimize()}
        >
          <Minus className="size-4" />
        </div>
        <div
          className="flex h-6 cursor-pointer items-center justify-center px-4 text-xs transition-colors duration-200 hover:bg-gray-100 hover:dark:bg-zinc-700"
          onClick={() => appWindow.toggleMaximize()}
        >
          <Maximize className="size-4" />
        </div>
        <div
          className="flex h-6 cursor-pointer items-center justify-center px-4 transition-colors duration-200 hover:bg-red-500 hover:dark:bg-red-500"
          onClick={() => appWindow.close()}
        >
          <X className="size-4" />
        </div>
      </div>
    </div>
  );
}
