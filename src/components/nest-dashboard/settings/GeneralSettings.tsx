import { cn } from "@/lib/utils/general.ts";
import { PanelLeft, PanelRight } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import Toggle from "./Toggle.tsx";
import {
  useFolderArrow,
  useFolderIndentLines,
  useCompactNestlingTitle,
  useNestlingTitleHidden,
  useSettingsActions,
  useSidebarHidden,
  useSidebarPosition,
  useTopbarHidden,
  useBlurStrength,
} from "@/stores/useSettingsStore.tsx";
import { useActiveBackgroundId } from "@/stores/useNestStore.tsx";
import { BlurStrength } from "@/lib/storage/settings.ts";

type Setting = {
  text: string;
  description: string;
} & (
  | { custom?: never; value: boolean; onChange: () => void }
  | { custom: React.ReactNode; value?: never; onChange?: never }
);

export default function GeneralSettings() {
  const activeBackgroundId = useActiveBackgroundId();

  const topbarHidden = useTopbarHidden();
  const sidebarHidden = useSidebarHidden();
  const sidebarPosition = useSidebarPosition();
  const compactNestlingTitle = useCompactNestlingTitle();
  const nestlingTitleHidden = useNestlingTitleHidden();
  const folderIndentLines = useFolderIndentLines();
  const folderArrow = useFolderArrow();
  const blurStrength = useBlurStrength();

  const { setSetting, resetSettings } = useSettingsActions();

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
        <div
          className={cn(
            "flex rounded-lg border border-gray-200 dark:border-gray-700",
            activeBackgroundId && "border-transparent dark:border-transparent",
          )}
        >
          <button
            onClick={() => setSetting("sidebarPosition", "left")}
            className={cn(
              "flex items-center gap-1.5 rounded-l-lg p-2 transition-colors",
              sidebarPosition === "left"
                ? "bg-teal-500 text-white dark:bg-teal-400 dark:text-gray-100"
                : cn(
                    "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300",
                    activeBackgroundId && "bg-gray-300 dark:bg-gray-700",
                  ),
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
                : cn(
                    "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300",
                    activeBackgroundId && "bg-gray-300 dark:bg-gray-700",
                  ),
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
      value: compactNestlingTitle,
      onChange: () => setSetting("compactNestlingTitle", !compactNestlingTitle),
    },
    {
      text: "Hide Nestling Title",
      description: "Completely hide the nestling title to save more space",
      value: nestlingTitleHidden,
      onChange: () => setSetting("nestlingTitleHidden", !nestlingTitleHidden),
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
    {
      text: "Glassmorphism Blur Strength",
      description: "Adjust the strength of the glassmorphism blur effect",
      custom: (
        <select
          value={blurStrength}
          onChange={(e) =>
            setSetting("blurStrength", e.target.value as BlurStrength)
          }
          className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:ring-teal-400"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      ),
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
          onClick={resetSettings}
          className="rounded-lg bg-red-500 px-4 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-600"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
