import { cn } from "@/lib/utils/general";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { Minus, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function Titlebar() {
  const appWindow = getCurrentWindow();
  const activeBackgroundId = useActiveBackgroundId();

  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    const updateMaximized = async () => {
      setIsMaximized(await appWindow.isMaximized());
    };

    updateMaximized();

    const unlisten = appWindow.onResized(() => {
      updateMaximized();
    });

    return () => {
      unlisten.then((fn) => fn());
    };
  }, [appWindow]);

  return (
    <div
      data-tauri-drag-region
      className="fixed z-100 flex h-6 w-full items-center justify-between dark:text-white"
    >
      <div
        className={cn(
          "ml-auto flex items-center",
          activeBackgroundId && "bg-white/30 backdrop-blur-sm dark:bg-black/30",
        )}
      >
        <div
          className={cn(
            "flex h-6 items-center justify-center px-4 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800",
            activeBackgroundId && "hover:bg-black/5 dark:hover:bg-white/5",
          )}
          onClick={() => appWindow.minimize()}
        >
          <Minus className="size-4 shrink-0" />
        </div>

        <div
          className={cn(
            "flex h-6 items-center justify-center px-4 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800",
            activeBackgroundId && "hover:bg-black/5 dark:hover:bg-white/5",
          )}
          onClick={async () => {
            await appWindow.toggleMaximize();
            setIsMaximized(await appWindow.isMaximized());
          }}
        >
          {isMaximized ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4 shrink-0"
            >
              <rect width="12" height="12" x="4" y="8" rx="2" />
              <path d="M9 4h8a3 3 0 0 1 3 3v8" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4 shrink-0"
            >
              <rect width="14" height="14" x="5" y="5" rx="2" />
            </svg>
          )}
        </div>

        <div
          className="group flex h-6 items-center justify-center px-4 transition-colors hover:bg-red-500"
          onClick={() => appWindow.close()}
        >
          <X className="size-4 shrink-0 group-hover:text-white" />
        </div>
      </div>
    </div>
  );
}
