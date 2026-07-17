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
  useSidebarToolbarHidden,
  useFontMode,
} from "@/stores/useSettingsStore.tsx";
import { useActiveBackgroundId } from "@/stores/useNestStore.tsx";
import { BlurStrength, FontMode } from "@/lib/storage/settings.ts";
import BaseSelectMenu from "@/components/select/BaseSelectMenu.tsx";

type Setting = {
  text: string;
  description: string;
} & (
  | { custom?: never; value: boolean; onChange: () => void }
  | { custom: React.ReactNode; value?: never; onChange?: never }
);

export default function GeneralSettings() {
  const activeBackgroundId = useActiveBackgroundId();

  const fontMode = useFontMode();
  const topbarHidden = useTopbarHidden();
  const sidebarHidden = useSidebarHidden();
  const sidebarPosition = useSidebarPosition();
  const sidebarToolbarHidden = useSidebarToolbarHidden();
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
            "flex rounded-lg border border-zinc-200 dark:border-zinc-700",
            activeBackgroundId && "border-transparent dark:border-transparent",
          )}
        >
          <button
            onClick={() => setSetting("sidebarPosition", "left")}
            className={cn(
              "flex items-center gap-1.5 rounded-l-lg p-2 transition-colors",
              sidebarPosition === "left"
                ? "bg-teal-500 text-white dark:bg-teal-400 dark:text-zinc-100"
                : cn(
                    "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300",
                    activeBackgroundId && "bg-zinc-300 dark:bg-zinc-700",
                  ),
            )}
          >
            <PanelLeft className="size-4 shrink-0" />
          </button>
          <button
            onClick={() => setSetting("sidebarPosition", "right")}
            className={cn(
              "flex items-center gap-1.5 rounded-r-lg p-2 transition-colors",
              sidebarPosition === "right"
                ? "bg-teal-500 text-white dark:bg-teal-400 dark:text-zinc-100"
                : cn(
                    "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300",
                    activeBackgroundId && "bg-zinc-300 dark:bg-zinc-700",
                  ),
            )}
          >
            <PanelRight className="size-4 shrink-0" />
          </button>
        </div>
      ),
    },
    {
      text: "Hide Sidebar Toolbar",
      description: "Hide the toolbar in the sidebar",
      value: sidebarToolbarHidden,
      onChange: () => setSetting("sidebarToolbarHidden", !sidebarToolbarHidden),
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
        <BaseSelectMenu
          value={blurStrength}
          onChange={(value) =>
            setSetting("blurStrength", value as BlurStrength)
          }
          options={[
            { value: "low", label: "Low" },
            { value: "medium", label: "Medium" },
            { value: "high", label: "High" },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            Theme
          </label>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Choose your preferred theme
          </p>
        </div>
        <ThemeToggle />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            Theme
          </label>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Choose your preferred theme
          </p>
        </div>

        <BaseSelectMenu
          value={fontMode}
          onChange={(value) => setSetting("fontMode", value as FontMode)}
          options={[
            { value: "sans", label: "Sans" },
            { value: "mono", label: "Mono" },
          ]}
        />
      </div>

      {settings.map((setting) => (
        <div key={setting.text} className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {setting.text}
            </label>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
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
          <label className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            Reset Settings
          </label>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
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
