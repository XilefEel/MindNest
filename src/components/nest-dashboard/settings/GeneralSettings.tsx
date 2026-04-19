import { ThemeToggle } from "./theme-toggle";
import Toggle from "./Toggle.tsx";
import { useSettingsStore } from "@/stores/useSettingsStore.tsx";

export default function GeneralSettings() {
  const {
    topbarHidden,
    sidebarHidden,
    nestlingTitleHidden,
    largeSidebarText,
    folderIndentLines,
    folderArrow,
    setSetting,
  } = useSettingsStore();

  const handleReset = () => {
    setSetting("topbarHidden", false);
    setSetting("sidebarHidden", false);
    setSetting("nestlingTitleHidden", false);
    setSetting("largeSidebarText", false);
    setSetting("folderIndentLines", true);
    setSetting("folderArrow", true);
  };

  const settings = [
    {
      text: "Hide Nest Topbar",
      description: "Hide the topbar across all nests",
      value: topbarHidden,
      onChange: () => setSetting("topbarHidden", !topbarHidden),
    },
    {
      text: "Hide Nest Sidebar",
      description: "Hide the sidebar across all nests",
      value: sidebarHidden,
      onChange: () => setSetting("sidebarHidden", !sidebarHidden),
    },
    {
      text: "Compact Nestling Title",
      description: "Hide folder path and tags to save space",
      value: nestlingTitleHidden,
      onChange: () => setSetting("nestlingTitleHidden", !nestlingTitleHidden),
    },
    {
      text: "Large Nest Sidebar Text",
      description: "Use larger text in the sidebar for better readability",
      value: largeSidebarText,
      onChange: () => setSetting("largeSidebarText", !largeSidebarText),
    },
    {
      text: "Show Folder Indent Lines",
      description: "Show indent lines beside folders",
      value: folderIndentLines,
      onChange: () => setSetting("folderIndentLines", !folderIndentLines),
    },
    {
      text: "Show Folder Arrow",
      description: "Show the arrow icon beside folders",
      value: folderArrow,
      onChange: () => setSetting("folderArrow", !folderArrow),
    },
  ];

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

      {settings.map((setting) => (
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {setting.text}
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {setting.description}
            </p>
          </div>
          <Toggle checked={setting.value} onChange={setting.onChange} />
        </div>
      ))}

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
