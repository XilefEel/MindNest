import { Folder } from "@/lib/types/folder";
import { cn } from "@/lib/utils/general";
import { useDraggable } from "@dnd-kit/core";
import { ChevronDown, Folder as FolderIcon, GripVertical } from "lucide-react";
import FolderContextMenu from "@/components/context-menu/FolderContextMenu";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import { useRef, useEffect } from "react";
import { useNestlingActions } from "@/stores/useNestlingStore";
import { useInlineEdit } from "@/hooks/useInlineEdit";

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

  const inputRef = useRef<HTMLInputElement>(null);

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

  const {
    value: name,
    setValue: setName,
    isEditing,
    setIsEditing,
    handleBlur,
    handleKeyDown,
  } = useInlineEdit({
    initialValue: folder.name,
    onSave: (name) => updateFolder(folder.id, { name }),
  });

  useEffect(() => {
    if (isEditing && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 1);
    }
  }, [isEditing]);

  return (
    <FolderContextMenu
      folderId={folder.id}
      handleRename={() => setIsEditing(true)}
    >
      <div
        onClick={handleClick}
        onDoubleClick={(e) => e.stopPropagation()}
        className="transition-[scale] active:scale-[0.98]"
      >
        <div
          style={style}
          className={cn(
            "flex items-center justify-between gap-1 rounded px-2 py-1 transition-[background] hover:bg-teal-50 dark:hover:bg-gray-700",
            activeBackgroundId
              ? "hover:bg-white/20 dark:hover:bg-black/20"
              : "hover:bg-gray-50 dark:hover:bg-gray-700/50",
          )}
        >
          <div className="flex min-w-0 flex-1 items-center gap-1.5">
            <ChevronDown
              className={cn(
                "size-4 flex-shrink-0 transition-transform duration-100",
                isFolderOpen ? "rotate-0" : "-rotate-90",
              )}
            />
            <FolderIcon className="size-4 flex-shrink-0" />
            <div
              className={cn(
                "min-w-0 flex-1 rounded transition-all",
                isEditing &&
                  cn(
                    "bg-teal-50 px-2 py-0.5 shadow-md ring-2 ring-teal-500",
                    activeBackgroundId
                      ? "bg-white/10 backdrop-blur-sm dark:bg-black/10"
                      : "bg-white px-2 py-0.5 shadow-md ring-2 ring-teal-500 dark:bg-gray-800",
                  ),
              )}
            >
              <input
                ref={inputRef}
                id="text"
                className={cn(
                  "w-full truncate bg-transparent focus:outline-none",
                  !isEditing && "pointer-events-none",
                )}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                readOnly={!isEditing}
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
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
      </div>
    </FolderContextMenu>
  );
}
