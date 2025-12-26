import { useState } from "react";
import BackgroundSection from "./BackgroundSection";
import MusicSection from "./MusicSection";
import { cn } from "@/lib/utils/general";
import { ImageIcon, Music, RotateCcw } from "lucide-react";

export default function NestSettings() {
  const [activeTab, setActiveTab] = useState("background");

  const tabs = [
    {
      id: "background",
      label: "Background",
      icon: <ImageIcon className="size-5" />,
    },
    { id: "music", label: "Music", icon: <Music className="size-5" /> },
    { id: "reset", label: "Reset", icon: <RotateCcw className="size-5" /> },
  ];

  return (
    <div className="flex flex-row gap-5">
      <div className="flex w-50 flex-col gap-1 border-r border-gray-200 pr-5 dark:border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "w-full cursor-pointer rounded-lg px-4 py-2 text-sm transition duration-200",
              activeTab === tab.id
                ? "bg-teal-100 font-medium text-teal-800 dark:bg-teal-500 dark:text-white"
                : "text-gray-800 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-700",
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
