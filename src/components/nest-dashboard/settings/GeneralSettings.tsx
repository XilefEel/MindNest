import { cn } from "@/lib/utils/general.ts";
import { PanelLeft, PanelRight } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import Toggle from "./Toggle.tsx";
import { useSettingsStore } from "@/stores/useSettingsStore.tsx";

type Setting = {
  text: string;
  description: string;
} & (
  | { custom?: never; value: boolean; onChange: () => void }
  | { custom: React.ReactNode; value?: never; onChange?: never }
);

export default function GeneralSettings() {
  const {
    topbarHidden,
    sidebarHidden,
    sidebarPosition,
    nestlingTitleHidden,
    largeSidebarText,
    folderIndentLines,
    folderArrow,
    setSetting,
  } = useSettingsStore();

  const handleReset = () => {
    setSetting("topbarHidden", false);
    setSetting("sidebarHidden", false);
    setSetting("sidebarPosition", "left");
    setSetting("nestlingTitleHidden", false);
    setSetting("largeSidebarText", false);
    setSetting("folderIndentLines", true);
    setSetting("folderArrow", true);
  };

  const settings: Setting[] = [
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
      text: "Nest Sidebar Position",
      description: "Move the sidebar to the left or right side",
      custom: (
        <div className="flex rounded-lg border border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setSetting("sidebarPosition", "left")}
            className={cn(
              "flex items-center gap-1.5 rounded-l-lg p-2 transition-colors",
              sidebarPosition === "left"
                ? "bg-teal-500 text-white dark:bg-teal-400 dark:text-gray-100"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300",
            )}
          >
            <PanelLeft className="size-4 flex-shrink-0" />
          </button>
          <button
            onClick={() => setSetting("sidebarPosition", "right")}
            className={cn(
              "flex items-center gap-1.5 rounded-r-lg p-2 transition-colors",
              sidebarPosition === "right"
                ? "bg-teal-500 text-white dark:bg-teal-400 dark:text-gray-100"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300",
            )}
          >
            <PanelRight className="size-4 flex-shrink-0" />
          </button>
        </div>
      ),
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
        <div key={setting.text} className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {setting.text}
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {setting.description}
            </p>
          </div>

          {setting.custom ?? (
            <Toggle checked={setting.value!} onChange={setting.onChange!} />
          )}
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
