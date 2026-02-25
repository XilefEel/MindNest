import BaseToolTip from "@/components/BaseToolTip";
import { cn } from "@/lib/utils/general";
import { useNestlingModal, useFolderModal } from "@/stores/useModalStore";
import { useNestlingActions } from "@/stores/useNestlingStore";
import { FilePlus, FolderPlus, Minimize2, Maximize2 } from "lucide-react";

export default function ToolBar({ nestId }: { nestId: number }) {
  const { toggleAllFolders } = useNestlingActions();
  const { openNestlingModal } = useNestlingModal();
  const { openFolderModal } = useFolderModal();

  const buttons = [
    {
      label: "New Note",
      onClick: () => openNestlingModal(nestId),
      icon: <FilePlus className="size-4" />,
    },
    {
      label: "New Folder",
      onClick: () => openFolderModal(nestId),
      icon: <FolderPlus className="size-4" />,
    },
    {
      label: "Collapse All",
      onClick: () => toggleAllFolders(false),
      icon: <Minimize2 className="size-4" />,
    },
    {
      label: "Expand All",
      onClick: () => toggleAllFolders(true),
      icon: <Maximize2 className="size-4" />,
    },
  ];

  return (
    <div className="mb-2.5 flex items-center border-b dark:border-white">
      {buttons.map((btn) => (
        <BaseToolTip label={btn.label}>
          <button
            onClick={btn.onClick}
            onDoubleClick={(e) => e.stopPropagation()}
            className={cn(
              "rounded-lg p-2 text-gray-800 dark:text-gray-200",
              "hover:text-teal-500 dark:hover:text-teal-300",
              "hover:bg-white/30 dark:hover:bg-white/10",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 dark:focus-visible:ring-teal-300",
            )}
          >
            {btn.icon}
          </button>
        </BaseToolTip>
      ))}
    </div>
  );
}
