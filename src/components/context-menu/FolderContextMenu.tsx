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
import ContextMenuSeperator from "./ContextMenuSeparator";

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
            action={handleRename!}
            Icon={Edit3}
            text="Rename Folder"
          />

          <ContextMenuItem
            action={() => duplicateFolder(folderId)}
            Icon={Copy}
            text="Duplicate Folder"
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
            text="New Folder"
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
