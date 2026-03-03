import {
  Edit3,
  Trash2,
  FolderPlus,
  Copy,
  FilePlus,
  Maximize2,
  Minimize2,
  Folder,
  FolderInput,
} from "lucide-react";
import ContextMenuItem from "./ContextMenuItem";
import BaseContextMenu from "./BaseContextMenu";
import { useActiveNestId } from "@/stores/useNestStore";
import { useFolders, useNestlingActions } from "@/stores/useNestlingStore";
import {
  useDeleteModal,
  useFolderModal,
  useNestlingModal,
} from "@/stores/useModalStore";
import ContextMenuSeperator from "./ContextMenuSeparator";
import * as ContextMenu from "@radix-ui/react-context-menu";
import { cn } from "@/lib/utils/general";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import { toast } from "@/lib/utils/toast";

export default function FolderContextMenu({
  folderId,
  handleRename,
  children,
}: {
  folderId: number;
  handleRename?: () => void;
  children: React.ReactNode;
}) {
  const activeNestId = useActiveNestId();
  const activeBackgroundId = useActiveBackgroundId();
  const folders = useFolders();

  const { duplicateFolder, setSubFolderOpen, moveFolder } =
    useNestlingActions();
  const { setDeleteTarget } = useDeleteModal();
  const { openNestlingModal } = useNestlingModal();
  const { openFolderModal } = useFolderModal();

  const handleMoveToFolder = (targetFolderId: number) => {
    try {
      moveFolder(folderId, targetFolderId);
    } catch (error) {
      toast.error("Failed to move folder.");
    }
  };

  return (
    <BaseContextMenu
      content={
        <>
          <ContextMenuItem
            action={handleRename!}
            Icon={Edit3}
            text="Rename Folder"
          />

          <ContextMenuItem
            action={() => duplicateFolder(folderId)}
            Icon={Copy}
            text="Duplicate Folder"
          />

          <ContextMenuItem
            action={() => setSubFolderOpen(folderId, true)}
            Icon={Maximize2}
            text="Expand All Subfolder"
          />

          <ContextMenuItem
            action={() => setSubFolderOpen(folderId, false)}
            Icon={Minimize2}
            text="Collapse All Subfolder"
          />

          <ContextMenu.Sub>
            <ContextMenu.SubTrigger
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className={cn(
                "mx-1 flex items-center gap-3 rounded px-3 py-2 text-sm transition-colors outline-none hover:bg-gray-100 dark:hover:bg-gray-700",
                activeBackgroundId &&
                  "hover:bg-white/30 dark:hover:bg-black/30",
              )}
            >
              <FolderInput className="h-4 w-4" />
              <span>Move to Folder</span>
            </ContextMenu.SubTrigger>

            <ContextMenu.Portal>
              <ContextMenu.SubContent
                className={cn(
                  "animate-in fade-in-0 zoom-in-95 z-50 min-w-[220px] rounded-lg border border-gray-200 bg-white py-2 shadow-lg select-none dark:border-gray-700 dark:bg-gray-800",
                  activeBackgroundId &&
                    "border-0 bg-white/30 backdrop-blur-sm hover:bg-white/30 dark:bg-black/30 dark:hover:bg-black/30",
                )}
              >
                {folders
                  .filter((f) => f.id !== folderId)
                  .map((f) => (
                    <ContextMenuItem
                      key={f.id}
                      action={() => handleMoveToFolder(f.id)}
                      Icon={Folder}
                      text={f.name}
                    >
                      {f.name}
                    </ContextMenuItem>
                  ))}
              </ContextMenu.SubContent>
            </ContextMenu.Portal>
          </ContextMenu.Sub>

          <ContextMenuSeperator />

          <ContextMenuItem
            action={() => {
              // setTimeout is REQUIRED for the modal to close properly
              // when called in context menu item
              setTimeout(() => openNestlingModal(activeNestId!, folderId), 0);
            }}
            Icon={FilePlus}
            text="New Nestling"
          />

          <ContextMenuItem
            action={() => {
              // setTimeout is REQUIRED for the modal to close properly
              // when called in context menu item
              setTimeout(() => openFolderModal(activeNestId!, folderId), 0);
            }}
            Icon={FolderPlus}
            text="New Subfolder"
          />

          <ContextMenuSeperator />

          <ContextMenuItem
            Icon={Trash2}
            text="Delete"
            isDelete
            action={() => {
              // setTimeout is REQUIRED for the modal to close properly
              // when called in context menu item
              setTimeout(() => setDeleteTarget("folder", folderId), 0);
            }}
          />
        </>
      }
    >
      {children}
    </BaseContextMenu>
  );
}
