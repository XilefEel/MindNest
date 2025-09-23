import * as ContextMenu from "@radix-ui/react-context-menu";
import { FilePlus, FolderPlus } from "lucide-react";
import AddFolderModal from "../modals/AddFolderModal";
import AddNestlingModal from "../modals/AddNestlingModal";

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
            {/* Using ContextMenu.Item instead of ContextMenuItem
              because modal triggers don't work with custom ContextMenuItem component*/}
            <ContextMenu.Item
              onSelect={(e) => {
                e.preventDefault();
              }}
              className="mx-1 flex cursor-pointer items-center gap-3 rounded px-3 py-2 text-sm transition-colors outline-none hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FilePlus className="h-4 w-4" />
              <span>New Nestling</span>
            </ContextMenu.Item>
          </AddNestlingModal>

          <AddFolderModal nestId={nestId}>
            {/* Using ContextMenu.Item instead of ContextMenuItem
              because modal triggers don't work with custom ContextMenuItem component*/}
            <ContextMenu.Item
              onSelect={(e) => {
                e.preventDefault();
              }}
              className="mx-1 flex cursor-pointer items-center gap-3 rounded px-3 py-2 text-sm transition-colors outline-none hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FolderPlus className="h-4 w-4" />
              <span>New Folder</span>
            </ContextMenu.Item>
          </AddFolderModal>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
}
