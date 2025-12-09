import { useState } from "react";
import GeneralSettings from "../settings/GeneralSettings";
import NestSettings from "../settings/NestSettings";
import { cn } from "@/lib/utils/general";
import BaseModal from "./BaseModal";
import { useActiveNestId } from "@/stores/useNestStore";

export default function SettingsModal({
  children,
  isOpen,
  setIsOpen,
}: {
  children: React.ReactNode;
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isActuallyOpen = isOpen ?? internalOpen;
  const setOpen = setIsOpen ?? setInternalOpen;

  const [activeTab, setActiveTab] = useState("general");
  const activeNestId = useActiveNestId();

  const tabs = [
    { id: "general", label: "General Settings" },
    { id: "nest", label: "Nest Settings" },
  ];

  return (
    <BaseModal
      isOpen={isActuallyOpen}
      setIsOpen={setOpen}
      title="Settings"
      showCancel={false}
      body={
        <>
          {activeNestId && (
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex-1 rounded-t-lg px-4 py-2 text-sm font-medium transition duration-200 ease-in-out",
                    activeTab === tab.id
                      ? "border-b-2 border-teal-600 bg-teal-200/50 text-teal-700 backdrop-blur-sm dark:border-teal-400 dark:bg-teal-900/40 dark:text-teal-300"
                      : "text-gray-700 hover:bg-white/50 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-black/30 dark:hover:text-white",
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          <div className="pb-8">
            {activeTab === "general" ? (
              <GeneralSettings />
            ) : activeTab === "nest" ? (
              <NestSettings />
            ) : null}
          </div>
        </>
      }
    >
      {children}
    </BaseModal>
  );
}
