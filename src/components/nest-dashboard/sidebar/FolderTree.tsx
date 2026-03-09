import { Folder } from "@/lib/types/folder";
import NestlingItem from "../sidebar/NestlingItem";
import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils/general";
import FolderContextMenu from "../../context-menu/FolderContextMenu";
import {
  useFolders,
  useNestlingActions,
  useNestlings,
  useNestlingStore,
} from "@/stores/useNestlingStore";
import FolderItem from "./FolderItem";
import { motion, AnimatePresence } from "framer-motion";
import { useActiveBackgroundId } from "@/stores/useNestStore";

export default function FolderTree({
  folder,
  setIsSidebarOpen,
}: {
  folder: Folder;
  setIsSidebarOpen: (isOpen: boolean) => void;
}) {
  const { toggleFolder } = useNestlingActions();
  const nestlings = useNestlings();
  const folders = useFolders();
  const openFolders = useNestlingStore((state) => state.openFolders);

  const activeBackgroundId = useActiveBackgroundId();

  const isFolderOpen = openFolders[folder.id] || false;

  const { setNodeRef, isOver } = useDroppable({
    id: `folder-${folder.id}`,
  });

  const childFolders = folders.filter((f) => f.parentId === folder.id);
  const childNestlings = nestlings.filter((n) => n.folderId === folder.id);

  return (
    <FolderContextMenu folderId={folder.id}>
      <motion.div key={folder.id} layout="position">
        <div
          ref={setNodeRef}
          className={cn(
            "flex flex-col rounded pt-0.5",
            isOver &&
              cn(
                activeBackgroundId
                  ? "bg-teal-200/50 dark:bg-teal-300/50"
                  : "bg-gray-100/80 dark:bg-gray-700/80",
              ),
          )}
        >
          <FolderItem
            folder={folder}
            isFolderOpen={isFolderOpen}
            toggleFolder={toggleFolder}
          />

          <AnimatePresence initial={false}>
            {isFolderOpen && (
              <motion.div
                key={`folder-content-${folder.id}`}
                layout
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0 }}
                className="ml-6"
              >
                {childFolders.map((childFolder) => (
                  <FolderTree
                    key={childFolder.id}
                    folder={childFolder}
                    setIsSidebarOpen={setIsSidebarOpen}
                  />
                ))}
                <div className="flex flex-col gap-0.5 pt-0.5">
                  {childNestlings.map((nestling) => (
                    <NestlingItem
                      key={nestling.id}
                      nestling={nestling}
                      setIsSidebarOpen={setIsSidebarOpen}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </FolderContextMenu>
  );
}
