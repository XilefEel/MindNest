import * as ContextMenu from "@radix-ui/react-context-menu";
import { Edit3, Trash2, FileText, FolderPlus, Copy } from "lucide-react";
import DeleteModal from "../modals/DeleteModal";
import ContextMenuItem from "./ContextMenuItem";
import BaseContextMenu from "./BaseContextMenu";

export default function FolderContextMenu({
  folderId,
  children,
}: {
  folderId: number;
  children: React.ReactNode;
}) {
  return (
    <BaseContextMenu
      content={
        <>
          <ContextMenuItem
            action={() => console.log("Rename folder", folderId)}
            Icon={Edit3}
            text="Rename Folder"
          />

          <ContextMenuItem
            action={() => console.log("Duplicate folder", folderId)}
            Icon={Copy}
            text="Duplicate Folder"
          />

          <ContextMenu.Separator className="mx-2 my-1 h-px bg-gray-200 dark:bg-gray-700" />

          <ContextMenuItem
            action={() => console.log("New nestling in folder", folderId)}
            Icon={FileText}
            text="New Note"
          />

          <ContextMenuItem
            action={() => console.log("New subfolder", folderId)}
            Icon={FolderPlus}
            text="New Subfolder"
          />

          <ContextMenu.Separator className="mx-2 my-1 h-px bg-gray-200 dark:bg-gray-700" />

          <DeleteModal type="folder" folderId={folderId}>
            {/* Using ContextMenu.Item instead of ContextMenuItem
              because modal triggers don't work with custom ContextMenuItem component*/}
            <ContextMenu.Item
              className="mx-1 flex cursor-pointer items-center gap-3 rounded px-3 py-2 text-sm text-red-600 transition-colors duration-200 outline-none hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/40"
              onSelect={(e) => {
                e.preventDefault();
                console.log("Delete folder", folderId);
              }}
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete Folder</span>
            </ContextMenu.Item>
          </DeleteModal>
        </>
      }
    >
      {children}
    </BaseContextMenu>
  );
}
