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
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-[90%] max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Settings</h2>
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="text-gray-400 hover:text-gray-700 dark:hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Toggle Mode</span>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );
}
