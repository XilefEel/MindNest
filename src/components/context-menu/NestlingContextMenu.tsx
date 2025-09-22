import * as ContextMenu from "@radix-ui/react-context-menu";
import { Edit3, Trash2, Copy, Star, Archive } from "lucide-react";
import DeleteModal from "../modals/DeleteModal";
import ContextMenuItem from "./ContextMenuItem";

export default function NestlingContextMenu({
  nestlingId,
  children,
}: {
  nestlingId: number;
  children: React.ReactNode;
}) {
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>{children}</ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content className="animate-in fade-in-0 zoom-in-95 z-50 min-w-[200px] rounded-lg border border-gray-200 bg-white py-2 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <ContextMenuItem
            Icon={Edit3}
            text="Rename"
            action={() => console.log("Rename note", nestlingId)}
          />

          <ContextMenuItem
            Icon={Copy}
            text="Duplicate"
            action={() => console.log("Duplicate note", nestlingId)}
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
            <ContextMenuItem
              Icon={Trash2}
              text="Delete"
              isDelete
              action={() => console.log("Delete note", nestlingId)}
            />
          </DeleteModal>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
}
