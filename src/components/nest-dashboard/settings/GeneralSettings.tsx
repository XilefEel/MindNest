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
} from "@/stores/useSettingsStore.tsx";
import { useActiveBackgroundId } from "@/stores/useNestStore.tsx";
import { BlurStrength } from "@/lib/storage/settings.ts";
import * as Select from "@radix-ui/react-select";
import { ChevronDown, Check } from "lucide-react";

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
        <Select.Root
          value={blurStrength}
          onValueChange={(value) =>
            setSetting("blurStrength", value as BlurStrength)
          }
        >
          <Select.Trigger
            className={cn(
              "flex items-center gap-3 rounded-lg border px-3 py-1 text-sm capitalize transition-colors focus:outline-none",
              activeBackgroundId
                ? "border-white/20 bg-white/10 backdrop-blur-sm hover:bg-black/5 dark:bg-white/5 dark:hover:bg-white/10"
                : "border-gray-200 text-gray-700 focus:ring-2 focus:ring-teal-500 dark:border-gray-700 dark:text-gray-200 dark:focus:ring-teal-400",
            )}
          >
            <Select.Value />
            <Select.Icon>
              <ChevronDown className="size-3 flex-shrink-0" />
            </Select.Icon>
          </Select.Trigger>

          <Select.Portal>
            <Select.Content
              position="popper"
              align="end"
              side="bottom"
              sideOffset={4}
              className={cn(
                "z-[100] w-28 overflow-hidden rounded-lg border shadow-sm",
                "data-[state=open]:animate-in data-[state=closed]:animate-out",
                "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
                activeBackgroundId
                  ? "border-white/20 bg-white/30 backdrop-blur-sm dark:bg-white/0"
                  : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800",
              )}
            >
              <Select.Viewport>
                {(["low", "medium", "high"] as BlurStrength[]).map((level) => (
                  <Select.Item
                    key={level}
                    value={level}
                    className={cn(
                      "flex cursor-default items-center justify-between px-3 py-1.5 text-sm capitalize transition-colors outline-none select-none",
                      "text-gray-800 dark:text-gray-200",
                      activeBackgroundId
                        ? "data-[highlighted]:bg-white/20 dark:data-[highlighted]:bg-white/10"
                        : "data-[highlighted]:bg-gray-50 dark:data-[highlighted]:bg-gray-700/50",
                    )}
                  >
                    <Select.ItemText>{level}</Select.ItemText>
                    <Select.ItemIndicator>
                      <Check
                        className={cn(
                          "size-3",
                          !activeBackgroundId &&
                            "text-teal-500 dark:text-teal-400",
                        )}
                      />
                    </Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
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
