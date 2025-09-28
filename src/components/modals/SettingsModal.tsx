import { useNestlingTreeStore } from "@/stores/useNestlingStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useState } from "react";
import GeneralSettings from "../settings/GeneralSettings";
import NestSettings from "../settings/NestSettings";
import { cn } from "@/lib/utils/general";

export default function SettingsModal({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const { nestId } = useNestlingTreeStore();

  const tabs = [
    { id: "general", label: "General Settings" },
    { id: "nest", label: "Nest Settings" },
  ];

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger className="w-full">{children}</DialogTrigger>
        <DialogContent className="w-full max-w-2xl rounded-2xl border-0 bg-white p-6 shadow-xl transition-all ease-in-out dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-black dark:text-white">
              Settings
            </DialogTitle>
          </DialogHeader>

          {nestId && (
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex-1 rounded-t-lg px-4 py-2 text-sm font-medium transition-colors",
                    activeTab === tab.id
                      ? "border-b-2 border-teal-600 bg-teal-50 text-teal-600 dark:border-teal-400 dark:bg-teal-900/20 dark:text-teal-400"
                      : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300",
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          <div className="pt-4 pb-8">
            {activeTab === "general" ? (
              <GeneralSettings />
            ) : activeTab === "nest" ? (
              <NestSettings />
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
