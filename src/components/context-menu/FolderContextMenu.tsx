import * as ContextMenu from "@radix-ui/react-context-menu";
import { Edit3, Trash2, FileText, FolderPlus, Copy } from "lucide-react";
import DeleteModal from "../modals/DeleteModal";
import ContextMenuItem from "./ContextMenuItem";

export default function FolderContextMenu({
  folderId,
  children,
}: {
  folderId: number;
  children: React.ReactNode;
}) {
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>{children}</ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content className="animate-in fade-in-0 zoom-in-95 z-50 min-w-[200px] rounded-lg border border-gray-200 bg-white py-2 shadow-lg dark:border-gray-700 dark:bg-gray-800">
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
            <ContextMenuItem
              action={() => console.log("Delete folder", folderId)}
              Icon={Trash2}
              text="Delete Folder"
              isDelete
            />
          </DeleteModal>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
}
