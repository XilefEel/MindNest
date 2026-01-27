import * as ContextMenu from "@radix-ui/react-context-menu";
import { Edit3, Trash2, FolderPlus, Copy, FilePlus } from "lucide-react";
import ContextMenuItem from "./ContextMenuItem";
import BaseContextMenu from "./BaseContextMenu";
import { useActiveNestId } from "@/stores/useNestStore";
import { useNestlingActions } from "@/stores/useNestlingStore";
import {
  useDeleteModal,
  useFolderModal,
  useNestlingModal,
} from "@/stores/useModalStore";

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
  const { duplicateFolder } = useNestlingActions();
  const { setDeleteTarget } = useDeleteModal();
  const { openNestlingModal } = useNestlingModal();
  const { openFolderModal } = useFolderModal();

  return (
    <BaseContextMenu
      content={
        <>
          <ContextMenuItem
            action={handleRename}
            Icon={Edit3}
            text="Rename Folder"
          />
          <ContextMenuItem
            action={() => duplicateFolder(folderId)}
            Icon={Copy}
            text="Duplicate Folder"
          />
          <ContextMenu.Separator className="mx-2 my-1 h-px bg-gray-200 dark:bg-gray-700" />

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
            text="New Folder"
          />

          <ContextMenu.Separator className="mx-2 my-1 h-px bg-gray-200 dark:bg-gray-700" />

          <ContextMenuItem
            Icon={Trash2}
            text="Delete"
            isDelete
            action={() => {
              // setTimeout is REQUIRED for the modal to close properly
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
