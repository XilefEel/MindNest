import { useEffect, useState } from "react";
import GeneralSettings from "../nest-dashboard/settings/GeneralSettings";
import NestSettings from "../nest-dashboard/settings/NestSettings";
import { cn } from "@/lib/utils/general";
import BaseModal from "./BaseModal";
import { useActiveBackgroundId, useActiveNestId } from "@/stores/useNestStore";
import { useSettingsModal } from "@/stores/useModalStore";

export default function SettingsModal() {
  const { isSettingsOpen, settingsTab, setIsSettingsOpen } = useSettingsModal();

  const [activeTab, setActiveTab] = useState("general");
  const activeNestId = useActiveNestId();
  const activeBackgroundId = useActiveBackgroundId();

  const tabs = [
    { id: "general", label: "General Settings" },
    { id: "nest", label: "Nest Settings" },
  ];

  useEffect(() => {
    if (isSettingsOpen && settingsTab) {
      setActiveTab(settingsTab);
    }
  }, [isSettingsOpen, settingsTab]);

  return (
    <BaseModal
      isOpen={isSettingsOpen}
      setIsOpen={setIsSettingsOpen}
      title="Settings"
      showCancel={false}
      isLarge
      body={
        <div className="flex h-[500px] flex-col">
          {activeNestId && (
            <div
              className={cn(
                "flex shrink-0 border-b border-gray-200 dark:border-zinc-700",
                activeBackgroundId && "border-black/30 dark:border-white/30",
              )}
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full rounded-t-xl px-4 py-2 text-sm transition-[background]",
                    activeBackgroundId
                      ? activeTab === tab.id
                        ? "border-b-2 border-teal-600 bg-teal-100/40 font-medium text-teal-600 dark:bg-teal-400/10 dark:text-teal-400"
                        : "hover:bg-black/5 dark:hover:bg-white/5"
                      : activeTab === tab.id
                        ? "border-b-2 border-teal-600 bg-teal-50 font-medium text-teal-600 dark:bg-teal-500/10 dark:text-teal-400"
                        : "hover:bg-gray-50 dark:hover:bg-zinc-700/50",
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-2 pt-4">
            {activeTab === "general" ? (
              <GeneralSettings />
            ) : activeTab === "nest" ? (
              <NestSettings />
            ) : null}
          </div>
        </div>
      }
    >
      <div />
    </BaseModal>
  );
}
