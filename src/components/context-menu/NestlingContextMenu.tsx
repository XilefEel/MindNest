import * as ContextMenu from "@radix-ui/react-context-menu";
import { Edit3, Trash2, Copy, Star, Archive } from "lucide-react";
import DeleteModal from "../modals/DeleteModal";
import ContextMenuItem from "./ContextMenuItem";
import BaseContextMenu from "./BaseContextMenu";
import { useNestlingStore } from "@/stores/useNestlingStore";
import NestlingModal from "../modals/NestlingModal";

export default function NestlingContextMenu({
  nestlingId,
  children,
}: {
  nestlingId: number;
  children: React.ReactNode;
}) {
  const { duplicateNestling } = useNestlingStore();

  return (
    <BaseContextMenu
      content={
        <>
          <NestlingModal nestlingId={nestlingId}>
            <ContextMenu.Item
              className="mx-1 flex cursor-pointer items-center gap-3 rounded px-3 py-2 text-sm transition-colors outline-none hover:bg-gray-100 dark:hover:bg-gray-700"
              onSelect={(e) => {
                e.preventDefault();
              }}
            >
              <Edit3 className="size-4" />
              Rename
            </ContextMenu.Item>
          </NestlingModal>

          <ContextMenuItem
            Icon={Copy}
            text="Duplicate"
            action={() => duplicateNestling(nestlingId)}
          />

          <ContextMenuItem
            Icon={Star}
            text="Add to Favorites"
            action={() => console.log("Star note", nestlingId)}
          />

          <ContextMenu.Separator className="mx-2 my-1 h-px bg-gray-200 dark:bg-gray-700" />

          <ContextMenuItem
            Icon={Archive}
            text="Archive"
            action={() => console.log("Archive note", nestlingId)}
          />

          <DeleteModal type="nestling" nestlingId={nestlingId}>
            {/* Using ContextMenu.Item instead of ContextMenuItem
              because modal triggers don't work with custom ContextMenuItem component*/}
            <ContextMenu.Item
              className="mx-1 flex cursor-pointer items-center gap-3 rounded px-3 py-2 text-sm text-red-600 transition-colors duration-200 outline-none hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/40"
              onSelect={(e) => {
                e.preventDefault();
                console.log("Delete folder", nestlingId);
              }}
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete</span>
            </ContextMenu.Item>
          </DeleteModal>
        </>
      }
    >
      {children}
    </BaseContextMenu>
  );
}
