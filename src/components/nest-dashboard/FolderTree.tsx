import { Folder } from "@/lib/types/folders";
import { Nestling } from "@/lib/types/nestlings";
import { ChevronDown, Folder as LucideFolder } from "lucide-react";
import NestlingItem from "./NestlingItem";
import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils/general";
import { motion } from "framer-motion";
import FolderContextMenu from "../context-menu/FolderContextMenu";
import { useNestlingStore } from "@/stores/useNestlingStore";

export default function FolderTree({
  folder,
  nestlings,
  isOpen,
  setIsSidebarOpen,
}: {
  folder: Folder;
  nestlings: Nestling[];
  isOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}) {
  const { toggleFolder } = useNestlingStore();

  const { setNodeRef, isOver } = useDroppable({
    id: `folder-${folder.id}`,
  });

  return (
    <FolderContextMenu folderId={folder.id}>
      <div
        ref={setNodeRef}
        className={cn(
          "flex cursor-pointer flex-col gap-1 rounded px-2 py-1 font-medium",
          isOver && "bg-teal-100 dark:bg-teal-400",
        )}
      >
        <motion.div
          onClick={() => toggleFolder(folder.id)}
          onDoubleClick={(e) => e.stopPropagation()}
          whileTap={{ scale: 0.98 }}
          className="flex cursor-pointer items-center gap-1 rounded px-2 py-1 font-medium transition-colors duration-200 hover:bg-teal-50 dark:hover:bg-gray-700"
        >
          <ChevronDown
            className={`size-4 transition-transform duration-200 ${isOpen ? "rotate-0" : "-rotate-90"}`}
          />
          <LucideFolder className="size-4" />
          <span>{folder.name}</span>
        </motion.div>

        {isOpen && (
          <div className="ml-6">
            {nestlings.map((nestling) => (
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
