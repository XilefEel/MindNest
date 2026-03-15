import { useEffect, useState } from "react";
import BackgroundSection from "./BackgroundSection";
import MusicSection from "./MusicSection";
import { cn } from "@/lib/utils/general";
import { ImageIcon, Music, RotateCcw, Keyboard } from "lucide-react";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import KeyboardShortcutsSection from "./KeyboardShorcutsSection";
import { useSettingsModal } from "@/stores/useModalStore";

export default function NestSettings() {
  const [activeTab, setActiveTab] = useState("background");
  const activeBackgroundId = useActiveBackgroundId();
  const { settingsSubTab } = useSettingsModal();

  const tabs = [
    {
      id: "background",
      label: "Background",
      icon: <ImageIcon className="size-4 flex-shrink-0" />,
    },
    {
      id: "music",
      label: "Music",
      icon: <Music className="size-4 flex-shrink-0" />,
    },
    {
      id: "shortcuts",
      label: "Shortcuts",
      icon: <Keyboard className="size-4 flex-shrink-0" />,
    },
    {
      id: "reset",
      label: "Reset",
      icon: <RotateCcw className="size-4 flex-shrink-0" />,
    },
  ];

  useEffect(() => {
    if (settingsSubTab) {
      setActiveTab(settingsSubTab);
    }
  }, [settingsSubTab]);

  return (
    <div className="flex h-full flex-row gap-5">
      <div
        className={cn(
          "flex w-50 flex-col gap-1 border-r border-gray-200 pr-5 dark:border-gray-700",
          activeBackgroundId && "border-black/30 dark:border-white/30",
        )}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "w-full rounded-lg px-4 py-2 text-sm transition-colors",
              activeBackgroundId
                ? activeTab === tab.id
                  ? "bg-teal-100/40 font-medium text-teal-600 dark:bg-teal-400/10 dark:text-teal-400"
                  : "hover:bg-white/20 dark:hover:bg-black/20"
                : activeTab === tab.id
                  ? "bg-teal-50 font-medium text-teal-600 dark:bg-teal-500/10 dark:text-teal-400"
                  : "hover:bg-gray-50 dark:hover:bg-gray-700/50",
            )}
          >
            <div className="flex flex-row items-center justify-start gap-2">
              <div>{tab.icon}</div>
              <span>{tab.label}</span>
            </div>
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto">
        {activeTab === "background" && <BackgroundSection />}
        {activeTab === "music" && <MusicSection />}
        {activeTab === "shortcuts" && <KeyboardShortcutsSection />}
        {activeTab === "reset" && (
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Reset Settings
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Restore all settings to defaults
              </p>
            </div>
            <button className="rounded-lg bg-red-500 px-4 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-600">
              Reset
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
