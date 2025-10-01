import BackgroundSection from "./BackgroundSection";

export default function NestSettings() {
  return (
    <div className="space-y-6">
      <BackgroundSection />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Reset Settings
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Restore all settings to defaults
          </p>
        </div>
        <button className="rounded-lg bg-red-500 px-4 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-red-600">
          Reset
        </button>
      </div>
    </div>
  );
}
