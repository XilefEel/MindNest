import * as ContextMenu from "@radix-ui/react-context-menu";
import { FilePlus, FolderPlus } from "lucide-react";
import AddFolderModal from "../modals/AddFolderModal";
import AddNestlingModal from "../modals/AddNestlingModal";
import ContextMenuItem from "./ContextMenuItem";

export function SidebarContextMenu({
  nestId,
  children,
}: {
  nestId: number;
  children: React.ReactNode;
}) {
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>{children}</ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content className="animate-in fade-in-0 zoom-in-95 z-50 min-w-[200px] rounded-lg border border-gray-200 bg-white py-2 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <AddNestlingModal nestId={nestId}>
            <ContextMenuItem
              action={() => {}}
              Icon={FilePlus}
              text="New Nestling"
            />
          </AddNestlingModal>

          <AddFolderModal nestId={nestId}>
            <ContextMenuItem
              action={() => {}}
              Icon={FolderPlus}
              text="New Folder"
            />
          </AddFolderModal>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
}
