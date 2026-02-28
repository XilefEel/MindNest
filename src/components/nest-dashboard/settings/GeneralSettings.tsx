import { ThemeToggle } from "./theme-toggle";
import Toggle from "./Toggle.tsx";
import { useSettingsStore } from "@/stores/useSettingsStore.tsx";

export default function GeneralSettings() {
  const { topbarHidden, sidebarHidden, nestlingTitleHidden, setSetting } =
    useSettingsStore();

  const handleReset = () => {
    setSetting("topbarHidden", false);
    setSetting("sidebarHidden", false);
    setSetting("nestlingTitleHidden", false);
  };

  return (
    <div className="flex flex-col gap-5">
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
            Hide Nest Topbar
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Hide the topbar across all nests
          </p>
        </div>
        <Toggle
          checked={topbarHidden}
          onChange={() => setSetting("topbarHidden", !topbarHidden)}
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Hide Nest Sidebar
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Hide the sidebar across all nests
          </p>
        </div>
        <Toggle
          checked={sidebarHidden}
          onChange={() => setSetting("sidebarHidden", !sidebarHidden)}
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Compact Nestling Title
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Hides folder path and tags to save space
          </p>
        </div>
        <Toggle
          checked={nestlingTitleHidden}
          onChange={() =>
            setSetting("nestlingTitleHidden", !nestlingTitleHidden)
          }
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Reset Settings
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Restore all settings to their defaults
          </p>
        </div>
        <button
          onClick={handleReset}
          className="rounded-lg bg-red-500 px-4 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-600"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
