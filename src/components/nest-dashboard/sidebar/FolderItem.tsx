import { Folder } from "@/lib/types/folder";
import { cn } from "@/lib/utils/general";
import { useDraggable } from "@dnd-kit/core";
import { ChevronDown, Folder as FolderIcon, GripVertical } from "lucide-react";
import FolderContextMenu from "@/components/context-menu/FolderContextMenu";
import { motion } from "framer-motion";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import { useState, useRef, useEffect } from "react";
import { useNestlingActions } from "@/stores/useNestlingStore";

export default function FolderItem({
  folder,
  isFolderOpen,
  toggleFolder,
}: {
  folder: Folder;
  isFolderOpen: boolean;
  toggleFolder: (id: number) => void;
}) {
  const activeBackgroundId = useActiveBackgroundId();
  const { updateFolder } = useNestlingActions();

  const [name, setName] = useState(folder.name);
  const [isEditing, setIsEditing] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const shouldSaveRef = useRef(true);

  const handleClick = () => {
    if (isEditing) return;
    toggleFolder(folder.id);
  };

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

  const handleBlur = async () => {
    setIsEditing(false);
    if (!shouldSaveRef.current) {
      shouldSaveRef.current = true;
      return;
    }
    if (name.trim() === "") {
      setName(folder.name);
      return;
    }
    if (name !== folder.name) {
      await updateFolder(folder.id, folder.parentId, name);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      shouldSaveRef.current = true;
      e.currentTarget.blur();
    }
    if (e.key === "Escape") {
      shouldSaveRef.current = false;
      setName(folder.name);
      e.currentTarget.blur();
    }
  };

  useEffect(() => {
    setName(folder.name);
  }, [folder.name]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  return (
    <FolderContextMenu
      folderId={folder.id}
      handleRename={() => setIsEditing(true)}
    >
      <motion.div
        whileTap={{ scale: 0.98 }}
        onClick={handleClick}
        onDoubleClick={(e) => e.stopPropagation()}
      >
        <div
          style={style}
          className={cn(
            "flex cursor-pointer items-center justify-between gap-1 rounded px-2 py-1 transition duration-100 hover:bg-teal-50 dark:hover:bg-gray-700",
            activeBackgroundId
              ? "hover:bg-white/20 dark:hover:bg-black/20"
              : "hover:bg-teal-50 dark:hover:bg-gray-700",
          )}
        >
          <div className="flex min-w-0 flex-1 items-center gap-1.5">
            <ChevronDown
              className={cn(
                "size-4 flex-shrink-0 transition duration-100",
                isFolderOpen ? "rotate-0" : "-rotate-90",
              )}
            />
            <FolderIcon className="size-4 flex-shrink-0" />
            <div
              className={cn(
                "min-w-0 flex-1 rounded text-gray-900 transition duration-100 dark:text-gray-100",
                isEditing &&
                  "bg-white px-2 py-0.5 shadow-md ring-2 ring-teal-500 dark:bg-gray-800",
              )}
            >
              <input
                ref={inputRef}
                className={cn(
                  "w-full truncate bg-transparent focus:outline-none",
                  !isEditing && "pointer-events-none",
                )}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                readOnly={!isEditing}
              />
            </div>
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
