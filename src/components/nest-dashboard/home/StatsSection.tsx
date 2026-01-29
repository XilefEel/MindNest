import { cn } from "@/lib/utils/general";
import { useFolders, useNestlings } from "@/stores/useNestlingStore";
import {
  useActiveBackgroundId,
  useBackgrounds,
  useMusic,
} from "@/stores/useNestStore";
import { useSettingsModal } from "@/stores/useModalStore";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { NestlingType } from "@/lib/types/nestling";
import { nestlingTypes } from "@/lib/utils/nestlings";

export default function StatsSection() {
  const nestlings = useNestlings();
  const folders = useFolders();
  const backgrounds = useBackgrounds();
  const music = useMusic();
  const activeBackgroundId = useActiveBackgroundId();
  const { setIsSettingsOpen } = useSettingsModal();

  const [popoverOpen, setPopoverOpen] = useState(false);

  const stats = [
    {
      label: "Nestlings",
      value: nestlings.length,
      icon: "🪺",
      type: "popover",
    },
    {
      label: "Folders",
      value: folders.length,
      icon: "📁",
    },
    {
      label: "Backgrounds",
      value: backgrounds.length,
      icon: "🖼️",
      type: "settings",
      onClick: () => setIsSettingsOpen(true),
    },
    {
      label: "Music",
      value: music.length,
      icon: "🎵",
      type: "settings",
      onClick: () => setIsSettingsOpen(true),
    },
  ];

  const nestlingTypeCount = nestlings.reduce(
    (acc, nestling) => {
      acc[nestling.nestlingType] = (acc[nestling.nestlingType] || 0) + 1;
      return acc;
    },
    {} as Record<NestlingType, number>,
  );

  const renderStatCard = (stat: (typeof stats)[0], i: number) => {
    const statCard = (
      <div
        className={cn(
          "flex flex-col items-center justify-center rounded-2xl",
          "group cursor-pointer rounded-xl border border-b-4 p-4 hover:shadow-md",
          "bg-white dark:bg-gray-800",
          "border-gray-200 border-b-orange-500 hover:border-orange-500 dark:border-gray-800 dark:border-b-orange-500 dark:hover:border-orange-500",
          "transition",
          activeBackgroundId &&
            "border-t-0 border-r-0 border-l-0 bg-white/10 backdrop-blur-sm dark:bg-black/10",
        )}
      >
        <div className="mb-3 text-4xl">{stat.icon}</div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          {stat.value}
        </div>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {stat.label}
        </span>
      </div>
    );

    if (stat.type === "popover") {
      return (
        <Popover key={i} open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>{statCard}</PopoverTrigger>
          <PopoverContent
            side="right"
            className={cn(
              "w-80 border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800",
              activeBackgroundId &&
                "border-0 bg-white/30 backdrop-blur-sm dark:bg-black/30",
            )}
          >
            <div className="mb-4 gap-1">
              <h2 className="text-lg font-semibold">Nestlings Breakdown</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total nestlings per type
              </p>
            </div>
            <div className="flex flex-col gap-2">
              {nestlings.length > 0 ? (
                nestlingTypes
                  .filter((nestling) => nestlingTypeCount[nestling.value] > 0)
                  .map((nestling) => {
                    const Icon = nestling.icon;
                    const count = nestlingTypeCount[nestling.value];

                    return (
                      <div
                        key={nestling.value}
                        className={cn(
                          "flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-700/50",
                          activeBackgroundId && "bg-white/50 dark:bg-black/30",
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn("rounded p-1.5", nestling.color)}>
                            <Icon className="size-4 text-white" />
                          </div>
                          <span className="text-sm">{nestling.label}</span>
                        </div>
                        <span
                          className={cn(
                            "flex size-6 items-center justify-center rounded-full bg-gray-200/50 text-sm font-semibold dark:bg-gray-600",
                            activeBackgroundId && "bg-black/5 dark:bg-white/10",
                          )}
                        >
                          {count}
                        </span>
                      </div>
                    );
                  })
              ) : (
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                  No nestlings yet
                </p>
              )}
            </div>
          </PopoverContent>
        </Popover>
      );
    }

    // For settings type, just render clickable card
    return (
      <div key={i} onClick={stat.onClick}>
        {statCard}
      </div>
    );
  };

  return (
    <section className="grid grid-cols-2 gap-5 md:grid-cols-4">
      {stats.map((stat, i) => renderStatCard(stat, i))}
    </section>
  );
}
