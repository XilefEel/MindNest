import { X } from "lucide-react";
import { ThemeToggle } from "../theme-toggle";

export default function SettingsModal({
  setIsSettingsOpen: setIsSettingsOpen,
}: {
  setIsSettingsOpen: (open: boolean) => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={() => setIsSettingsOpen(false)}
    >
      <div
        className="w-[90%] max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Settings</h2>
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="text-gray-400 transition hover:text-gray-700 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Toggle Mode</span>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );
}
