import { useState } from "react";
import GeneralSettings from "../nest-dashboard/settings/GeneralSettings";
import NestSettings from "../nest-dashboard/settings/NestSettings";
import { cn } from "@/lib/utils/general";
import BaseModal from "./BaseModal";
import { useActiveBackgroundId, useActiveNestId } from "@/stores/useNestStore";
import { useSettingsModal } from "@/stores/useModalStore";

export default function SettingsModal() {
  const { isSettingsOpen, setIsSettingsOpen } = useSettingsModal();

  const [activeTab, setActiveTab] = useState("general");
  const activeNestId = useActiveNestId();
  const activeBackgroundId = useActiveBackgroundId();

  const tabs = [
    { id: "general", label: "General Settings" },
    { id: "nest", label: "Nest Settings" },
  ];

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
            <div className="flex shrink-0 border-b border-gray-200 dark:border-gray-700">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex-1 rounded-t-lg px-4 py-2 text-sm",
                    activeTab === tab.id
                      ? activeBackgroundId
                        ? "border-b-2 border-teal-600 bg-teal-500/20 font-medium text-teal-900 backdrop-blur-md dark:border-teal-400 dark:bg-teal-400/20 dark:text-teal-100"
                        : "border-b-2 border-teal-600 bg-teal-100 font-medium text-teal-800 dark:border-teal-400 dark:bg-teal-900/50 dark:text-teal-300"
                      : activeBackgroundId
                        ? "text-gray-900 hover:bg-white/40 dark:text-gray-100 dark:hover:bg-white/10"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
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
