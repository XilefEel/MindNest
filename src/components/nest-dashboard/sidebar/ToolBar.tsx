import BaseToolTip from "@/components/BaseToolTip";
import FolderModal from "@/components/modals/FolderModal";
import NestlingModal from "@/components/modals/NestlingModal";
import { cn } from "@/lib/utils/general";
import { useNestlingActions } from "@/stores/useNestlingStore";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import { FilePlus, FolderPlus, Minimize2, Maximize2 } from "lucide-react";

export default function ToolBar({ nestId }: { nestId: number }) {
  const { toggleAllFolders } = useNestlingActions();
  const activeBackgroundId = useActiveBackgroundId();
  return (
    <div className="mb-2.5 flex items-center border-b dark:border-white">
      <NestlingModal nestId={nestId}>
        <div>
          <BaseToolTip label="New Note">
            <button
              onDoubleClick={(e) => e.stopPropagation()}
              className={cn(
                "cursor-pointer rounded-lg p-2 transition-all duration-200 hover:text-teal-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-teal-300",
                activeBackgroundId &&
                  "hover:bg-white/30 dark:hover:bg-black/30",
              )}
            >
              <FilePlus className="size-4" />
            </button>
          </BaseToolTip>
        </div>
      </NestlingModal>

      <FolderModal nestId={nestId}>
        <div>
          <BaseToolTip label="New Folder">
            <button
              onDoubleClick={(e) => e.stopPropagation()}
              className={cn(
                "cursor-pointer rounded-lg p-2 transition-all duration-200 hover:text-teal-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-teal-300",
                activeBackgroundId &&
                  "hover:bg-white/30 dark:hover:bg-black/30",
              )}
            >
              <FolderPlus className="size-4" />
            </button>
          </BaseToolTip>
        </div>
      </FolderModal>

      <BaseToolTip label="Collapse All">
        <button
          onClick={() => toggleAllFolders(false)}
          onDoubleClick={(e) => e.stopPropagation()}
          className={cn(
            "cursor-pointer rounded-lg p-2 transition-all duration-200 hover:text-teal-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-teal-300",
            activeBackgroundId && "hover:bg-white/30 dark:hover:bg-black/30",
          )}
        >
          <Minimize2 className="size-4" />
        </button>
      </BaseToolTip>

      <BaseToolTip label="Expand All">
        <button
          onClick={() => toggleAllFolders(true)}
          onDoubleClick={(e) => e.stopPropagation()}
          className={cn(
            "cursor-pointer rounded-lg p-2 transition-all duration-200 hover:text-teal-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-teal-300",
            activeBackgroundId && "hover:bg-white/30 dark:hover:bg-black/30",
          )}
        >
          <Maximize2 className="size-4" />
        </button>
      </BaseToolTip>
    </div>
  );
}
