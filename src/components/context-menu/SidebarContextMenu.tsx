import { FilePlus, FolderPlus } from "lucide-react";

import BaseContextMenu from "./BaseContextMenu";
import ContextMenuItem from "./ContextMenuItem";
import { useFolderModal, useNestlingModal } from "@/stores/useModalStore";

export function SidebarContextMenu({
  nestId,
  children,
}: {
  nestId: number;
  children: React.ReactNode;
}) {
  const { openNestlingModal } = useNestlingModal();
  const { openFolderModal } = useFolderModal();
  return (
    <BaseContextMenu
      content={
        <>
          <ContextMenuItem
            action={() => {
              // setTimeout is REQUIRED for the modal to close properly
              // when called in context menu item
              setTimeout(() => openNestlingModal(nestId), 0);
            }}
            Icon={FilePlus}
            text="New Nestling"
          />

          <ContextMenuItem
            action={() => {
              // setTimeout is REQUIRED for the modal to close properly
              // when called in context menu item
              setTimeout(() => openFolderModal(nestId!), 0);
            }}
            Icon={FolderPlus}
            text="New Folder"
          />
        </>
      }
    >
      {children}
    </BaseContextMenu>
  );
}
