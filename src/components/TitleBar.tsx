import { getCurrentWindow } from "@tauri-apps/api/window";
import { Maximize, Minus, X } from "lucide-react";

export default function Titlebar() {
  const appWindow = getCurrentWindow();
  return (
    <div
      data-tauri-drag-region
      className="w-full h-8 dark:bg-zinc-900 dark:text-white flex justify-between items-center"
    >
      <div className="ml-auto flex items-center">
        <div
          className="cursor-pointer hover:bg-gray-100 hover:dark:bg-zinc-700 h-8 px-4 flex items-center justify-center transition-colors duration-200"
          onClick={() => appWindow.minimize()}
        >
          <Minus className="size-4" />
        </div>
        <div
          className="cursor-pointer text-xs hover:bg-gray-100 hover:dark:bg-zinc-700 h-8 px-4 flex items-center justify-center transition-colors duration-200"
          onClick={() => appWindow.toggleMaximize()}
        >
          <Maximize className="size-4" />
        </div>
        <div
          className="cursor-pointer hover:bg-red-500 hover:dark:bg-red-500 h-8 px-4 flex items-center justify-center transition-colors duration-200"
          onClick={() => appWindow.close()}
        >
          <X className="size-4" />
        </div>
      </div>
    </div>
  );
}
