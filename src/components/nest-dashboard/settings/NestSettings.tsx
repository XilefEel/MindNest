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
      icon: <ImageIcon className="size-5" />,
    },
    { id: "music", label: "Music", icon: <Music className="size-5" /> },
    {
      id: "shortcuts",
      label: "Shortcuts",
      icon: <Keyboard className="size-5" />,
    },
    { id: "reset", label: "Reset", icon: <RotateCcw className="size-5" /> },
  ];

  useEffect(() => {
    if (settingsSubTab) {
      setActiveTab(settingsSubTab);
    }
  }, [settingsSubTab]);

  return (
    <div className="flex h-full flex-row gap-5">
      <div className="flex w-50 flex-col gap-1 border-r border-gray-200 pr-5 dark:border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "w-full rounded-lg px-4 py-2 text-sm",
              activeTab === tab.id
                ? activeBackgroundId
                  ? "bg-teal-500/20 font-medium text-teal-900 backdrop-blur-sm dark:bg-teal-400/20 dark:text-teal-100"
                  : "bg-teal-100 font-medium text-teal-800 dark:bg-teal-900/50 dark:text-teal-300"
                : activeBackgroundId
                  ? "text-gray-900 hover:bg-white/40 dark:text-gray-100 dark:hover:bg-white/10"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
            )}
          >
            <div className="flex flex-row items-center justify-start gap-3">
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
            <button className="rounded-lg bg-red-500 px-4 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-red-600">
              Reset
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
