import * as ContextMenu from "@radix-ui/react-context-menu";
import { Edit3, Trash2, FileText, FolderPlus, Copy } from "lucide-react";
import DeleteModal from "../modals/DeleteModal";
import ContextMenuItem from "./ContextMenuItem";
import BaseContextMenu from "./BaseContextMenu";
import AddFolderModal from "../modals/FolderModal";
import { useNestStore } from "@/stores/useNestStore";
import NestlingModal from "../modals/NestlingModal";
import { useNestlingStore } from "@/stores/useNestlingStore";

export default function FolderContextMenu({
  folderId,
  children,
}: {
  folderId: number;
  children: React.ReactNode;
}) {
  const { activeNestId } = useNestStore();
  const { duplicateFolder } = useNestlingStore();
  return (
    <BaseContextMenu
      content={
        <>
          <AddFolderModal folderId={folderId} nestId={activeNestId!}>
            <ContextMenu.Item
              className="mx-1 flex cursor-pointer items-center gap-3 rounded px-3 py-2 text-sm transition-colors outline-none hover:bg-gray-100 dark:hover:bg-gray-700"
              onSelect={(e) => {
                e.preventDefault();
              }}
            >
              <Edit3 className="size-4" />
              Rename Folder
            </ContextMenu.Item>
          </AddFolderModal>

          <ContextMenuItem
            action={() => duplicateFolder(folderId)}
            Icon={Copy}
            text="Duplicate Folder"
          />

          <ContextMenu.Separator className="mx-2 my-1 h-px bg-gray-200 dark:bg-gray-700" />

          <NestlingModal nestId={activeNestId!}>
            <ContextMenu.Item
              className="mx-1 flex cursor-pointer items-center gap-3 rounded px-3 py-2 text-sm transition-colors outline-none hover:bg-gray-100 dark:hover:bg-gray-700"
              onSelect={(e) => {
                e.preventDefault();
              }}
            >
              <FileText className="size-4" />
              New Nestling
            </ContextMenu.Item>
          </NestlingModal>

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
