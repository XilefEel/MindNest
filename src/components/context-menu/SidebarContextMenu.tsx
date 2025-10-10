import * as ContextMenu from "@radix-ui/react-context-menu";
import { FilePlus, FolderPlus } from "lucide-react";
import AddFolderModal from "../modals/FolderModal";
import NestlingModal from "../modals/NestlingModal";
import BaseContextMenu from "./BaseContextMenu";

export function SidebarContextMenu({
  nestId,
  children,
}: {
  nestId: number;
  children: React.ReactNode;
}) {
  return (
    <BaseContextMenu
      content={
        <>
          <NestlingModal nestId={nestId}>
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
          </NestlingModal>

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
        </>
      }
    >
      {children}
    </BaseContextMenu>
  );
}
