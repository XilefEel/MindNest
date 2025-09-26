import { Folder } from "@/lib/types/folders";
import { Nestling } from "@/lib/types/nestlings";
import { ChevronDown, Folder as LucideFolder } from "lucide-react";
import NestlingItem from "./NestlingItem";
import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils/general";
import NestlingContextMenu from "../context-menu/NestlingContextMenu";
import { motion } from "framer-motion";

export default function FolderTree({
  folder,
  nestlings,
  isOpen,
  setIsSidebarOpen,
  onToggle,
}: {
  folder: Folder;
  nestlings: Nestling[];
  isOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  onToggle: () => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `folder-${folder.id}`,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex cursor-pointer flex-col gap-1 rounded px-2 py-1 font-medium",
        isOver && "bg-teal-100 dark:bg-teal-400",
      )}
    >
      <div
        onClick={onToggle}
        className="flex cursor-pointer items-center gap-1 rounded px-2 py-1 font-medium transition-colors duration-200 hover:bg-teal-50 dark:hover:bg-gray-700"
      >
        <ChevronDown
          className={`size-4 transition-transform duration-200 ${isOpen ? "rotate-0" : "-rotate-90"}`}
        />
        <LucideFolder className="size-4" />
        <span>{folder.name}</span>
      </div>
      {isOpen && (
        <div className="ml-6">
          {nestlings.map((nestling) => (
            <motion.div
              key={nestling.id}
              layout
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{
                opacity: 0,
                transition: { duration: 0.2 },
              }}
              transition={{
                type: "spring",
                stiffness: 250,
                damping: 25,
              }}
            >
              <NestlingContextMenu nestlingId={nestling.id} key={nestling.id}>
                <div>
                  <NestlingItem
                    nestling={nestling}
                    setIsSidebarOpen={setIsSidebarOpen}
                  />
                </div>
              </NestlingContextMenu>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
