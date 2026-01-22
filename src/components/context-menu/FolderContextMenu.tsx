import * as ContextMenu from "@radix-ui/react-context-menu";
import { Edit3, Trash2, FileText, FolderPlus, Copy } from "lucide-react";
import DeleteModal from "../modals/DeleteModal";
import ContextMenuItem from "./ContextMenuItem";
import BaseContextMenu from "./BaseContextMenu";
import FolderModal from "../modals/FolderModal";
import { useActiveBackgroundId, useActiveNestId } from "@/stores/useNestStore";
import NestlingModal from "../modals/NestlingModal";
import { useNestlingActions } from "@/stores/useNestlingStore";
import { cn } from "@/lib/utils/general";

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
  const activeBackgroundId = useActiveBackgroundId();
  const { duplicateFolder } = useNestlingActions();

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

          <NestlingModal nestId={activeNestId!} folderId={folderId}>
            <ContextMenu.Item
              className={cn(
                "mx-1 flex cursor-pointer items-center gap-3 rounded px-3 py-2 text-sm transition-colors outline-none hover:bg-gray-100 dark:hover:bg-gray-700",
                activeBackgroundId &&
                  "hover:bg-white/30 dark:hover:bg-black/30",
              )}
              onSelect={(e) => {
                e.preventDefault();
              }}
            >
              <FileText className="size-4" />
              New Nestling
            </ContextMenu.Item>
          </NestlingModal>

          <FolderModal parentId={folderId} nestId={activeNestId!}>
            <ContextMenu.Item
              className={cn(
                "mx-1 flex cursor-pointer items-center gap-3 rounded px-3 py-2 text-sm transition-colors outline-none hover:bg-gray-100 dark:hover:bg-gray-700",
                activeBackgroundId &&
                  "hover:bg-white/30 dark:hover:bg-black/30",
              )}
              onSelect={(e) => {
                e.preventDefault();
              }}
            >
              <FolderPlus className="size-4" />
              New Subfolder
            </ContextMenu.Item>
          </FolderModal>

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
