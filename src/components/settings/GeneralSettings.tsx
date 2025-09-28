import { ThemeToggle } from "./theme-toggle";

export default function GeneralSettings() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Theme
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Choose your preferred theme
          </p>
        </div>
        <ThemeToggle />
      </div>
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Reset Settings
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Restore all settings to defaults
          </p>
        </div>
        <button className="rounded-md bg-red-600 px-3 py-1 text-sm text-white transition-colors hover:bg-red-700">
          Reset
        </button>
      </div>
    </div>
  );
}
