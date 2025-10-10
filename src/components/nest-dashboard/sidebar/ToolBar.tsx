import BaseToolTip from "@/components/BaseToolTip";
import ToolBarItem from "@/components/editors/note/ToolBarItem";
import AddFolderModal from "@/components/modals/FolderModal";
import NestlingModal from "@/components/modals/NestlingModal";
import { useNestlingStore } from "@/stores/useNestlingStore";
import { FilePlus, FolderPlus, Minimize2, Maximize2 } from "lucide-react";

export default function ToolBar({ nestId }: { nestId: number }) {
  const { toggleAllFolders } = useNestlingStore();
  return (
    <div className="mb-2.5 flex items-center border-b dark:border-white">
      <NestlingModal nestId={nestId}>
        <div>
          <ToolBarItem Icon={FilePlus} label="New Note" />
        </div>
      </NestlingModal>
      <AddFolderModal nestId={nestId}>
        <div>
          <ToolBarItem Icon={FolderPlus} label="New Folder" />
        </div>
      </AddFolderModal>

      <BaseToolTip label="Collapse All">
        <button
          onClick={() => toggleAllFolders(false)}
          className="cursor-pointer rounded-lg p-2 transition-all duration-200 hover:text-teal-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-teal-300"
        >
          <Minimize2 className="size-4" />
        </button>
      </BaseToolTip>

      <BaseToolTip label="Expand All">
        <button
          onClick={() => toggleAllFolders(true)}
          className="cursor-pointer rounded-lg p-2 transition-all duration-200 hover:text-teal-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-teal-300"
        >
          <Maximize2 className="size-4" />
        </button>
      </BaseToolTip>
    </div>
  );
}
