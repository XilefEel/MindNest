import { Folder } from "@/lib/types/folders";
import { ChevronDown, Folder as LucideFolder } from "lucide-react";
import NestlingItem from "../sidebar/NestlingItem";
import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils/general";
import { motion } from "framer-motion";
import FolderContextMenu from "../../context-menu/FolderContextMenu";
import { useNestlingStore } from "@/stores/useNestlingStore";

export default function FolderTree({
  folder,
  setIsSidebarOpen,
}: {
  folder: Folder;
  setIsSidebarOpen: (isOpen: boolean) => void;
}) {
  const { toggleFolder, openFolders, nestlings, folders } = useNestlingStore();
  const isFolderOpen = openFolders[folder.id] || false;

  const { setNodeRef, isOver } = useDroppable({
    id: `folder-${folder.id}`,
  });

  const childFolders = folders.filter((f) => f.parent_id === folder.id);
  const childNestlings = nestlings.filter((n) => n.folder_id === folder.id);

  return (
    <FolderContextMenu folderId={folder.id}>
      <div
        className={cn(
          "flex cursor-pointer flex-col gap-1 rounded py-1 font-medium",
          isOver && "bg-teal-100 dark:bg-teal-400",
        )}
      >
        <motion.div
          ref={setNodeRef}
          onClick={() => toggleFolder(folder.id)}
          onDoubleClick={(e) => e.stopPropagation()}
          whileTap={{ scale: 0.98 }}
          className="flex cursor-pointer items-center gap-1 rounded px-2 py-1 font-medium transition-colors duration-200 hover:bg-teal-50 dark:hover:bg-gray-700"
        >
          <ChevronDown
            className={`size-4 transition-transform duration-200 ${isFolderOpen ? "rotate-0" : "-rotate-90"}`}
          />
          <LucideFolder className="size-4" />
          <span>{folder.name}</span>
        </motion.div>

        {isFolderOpen && (
          <div className="ml-6">
            {childFolders.map((childFolder) => (
              <FolderTree
                key={childFolder.id}
                folder={childFolder}
                setIsSidebarOpen={setIsSidebarOpen}
              />
            ))}

            {childNestlings.map((nestling) => (
              <motion.div
                key={nestling.id}
                layout="position"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{
                  opacity: 0,
                  y: -10,
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.98 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
              >
                <NestlingItem
                  key={nestling.id}
                  nestling={nestling}
                  setIsSidebarOpen={setIsSidebarOpen}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </FolderContextMenu>
  );
}
