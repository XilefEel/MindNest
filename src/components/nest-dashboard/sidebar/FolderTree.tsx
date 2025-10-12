import { Folder } from "@/lib/types/folders";
import NestlingItem from "../sidebar/NestlingItem";
import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils/general";
import FolderContextMenu from "../../context-menu/FolderContextMenu";
import { useNestlingStore } from "@/stores/useNestlingStore";
import FolderItem from "./FolderItem";
import { motion } from "framer-motion";

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
      <motion.div
        key={folder.id}
        layout="position"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20, transition: { duration: 0.2 } }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
      >
        <div
          ref={setNodeRef}
          className={cn(
            "flex cursor-pointer flex-col gap-1 rounded py-1 font-medium",
            isOver && "bg-teal-100 dark:bg-teal-400",
          )}
        >
          <FolderItem
            folder={folder}
            isFolderOpen={isFolderOpen}
            toggleFolder={toggleFolder}
          />

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
                <NestlingItem
                  key={nestling.id}
                  nestling={nestling}
                  setIsSidebarOpen={setIsSidebarOpen}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </FolderContextMenu>
  );
}
