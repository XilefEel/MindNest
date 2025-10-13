import { Folder } from "@/lib/types/folder";
import { cn } from "@/lib/utils/general";
import { useDraggable } from "@dnd-kit/core";
import { ChevronDown, Folder as FolderIcon, GripVertical } from "lucide-react";
import FolderContextMenu from "@/components/context-menu/FolderContextMenu";
import { motion } from "framer-motion";

export default function FolderItem({
  folder,
  isFolderOpen,
  toggleFolder,
}: {
  folder: Folder;
  isFolderOpen: boolean;
  toggleFolder: (id: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `folder-${folder.id}`,
    });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <FolderContextMenu folderId={folder.id}>
      <motion.div
        whileTap={{ scale: 0.98 }}
        onClick={() => toggleFolder(folder.id)}
        onDoubleClick={(e) => e.stopPropagation()}
      >
        <div
          style={style}
          className={cn(
            "flex cursor-pointer items-center justify-between gap-1 rounded px-2 py-1 transition-colors duration-200 hover:bg-teal-50 dark:hover:bg-gray-700",
            isDragging && "opacity-50",
          )}
        >
          <div className="flex items-center gap-1">
            <ChevronDown
              className={`size-4 transition-transform duration-200 ${
                isFolderOpen ? "rotate-0" : "-rotate-90"
              }`}
            />
            <FolderIcon className="size-4" />
            <span className="max-w-[140px] truncate">{folder.name}</span>
          </div>

          <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            onClick={(e) => e.stopPropagation()}
            className="cursor-grab p-1"
          >
            <GripVertical className="size-4 text-gray-500 dark:text-gray-200" />
          </div>
        </div>
      </motion.div>
    </FolderContextMenu>
  );
}
