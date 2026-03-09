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
  ChevronRight,
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
import { toast } from "@/lib/utils/toast";
import ContextSubMenu from "./ContextSubMenu";

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

          <ContextSubMenu
            trigger={
              <>
                <FolderInput className="size-4 flex-shrink-0" />
                <span>Move to Folder</span>
                <ChevronRight className="ml-auto" size={16} />
              </>
            }
            content={
              <>
                {folders.filter((f) => f.id !== folderId).length === 0 ? (
                  <p className="px-3 py-2 text-center text-sm text-gray-500 dark:text-gray-400">
                    No other folders available.
                  </p>
                ) : (
                  folders
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
                    ))
                )}
              </>
            }
          />

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
