import { useEffect, useState } from "react";
import BackgroundSection from "./BackgroundSection";
import MusicSection from "./MusicSection";
import { cn } from "@/lib/utils/general";
import { ImageIcon, Music, RotateCcw, Keyboard } from "lucide-react";
import { useActiveBackgroundId, useNestActions } from "@/stores/useNestStore";
import KeyboardShortcutsSection from "./KeyboardShorcutsSection";
import { useSettingsModal } from "@/stores/useModalStore";

export default function NestSettings() {
  const [activeTab, setActiveTab] = useState("background");
  const activeBackgroundId = useActiveBackgroundId();
  const { settingsSubTab } = useSettingsModal();
  const { clearActiveBackgroundId, setBackgroundBrightness, setMusicVolume } =
    useNestActions();

  const tabs = [
    {
      id: "background",
      label: "Background",
      Icon: ImageIcon,
    },
    {
      id: "music",
      label: "Music",
      Icon: Music,
    },
    {
      id: "shortcuts",
      label: "Shortcuts",
      Icon: Keyboard,
    },
    {
      id: "reset",
      label: "Reset",
      Icon: RotateCcw,
    },
  ];

  const handleReset = () => {
    clearActiveBackgroundId();
    setBackgroundBrightness(1);
    setMusicVolume(0.5);
  };

  useEffect(() => {
    if (settingsSubTab) {
      setActiveTab(settingsSubTab);
    }
  }, [settingsSubTab]);

  return (
    <div className="flex h-full flex-row gap-5">
      <div
        className={cn(
          "flex flex-col gap-1 border-r border-gray-200 pr-4 md:w-50 md:pr-5 dark:border-zinc-700",
          activeBackgroundId && "border-black/30 dark:border-white/30",
        )}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "w-full rounded-lg px-2 py-2 text-sm transition-colors md:px-4",
              activeBackgroundId
                ? activeTab === tab.id
                  ? "bg-teal-100/40 font-medium text-teal-600 dark:bg-teal-400/10 dark:text-teal-400"
                  : "hover:bg-black/5 dark:hover:bg-white/5"
                : activeTab === tab.id
                  ? "bg-teal-50 font-medium text-teal-600 dark:bg-teal-500/10 dark:text-teal-400"
                  : "hover:bg-gray-50 dark:hover:bg-zinc-700/50",
            )}
          >
            <div className="flex flex-row items-center justify-start gap-2">
              <tab.Icon className="size-4 flex-shrink-0" />
              <span className="hidden md:block">{tab.label}</span>
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
              <h1 className="text-sm font-medium text-gray-900 dark:text-zinc-100">
                Reset Settings
              </h1>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                Restore all settings to defaults
              </p>
            </div>
            <button
              onClick={handleReset}
              className="rounded-lg bg-red-500 px-4 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-600"
            >
              Reset
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
