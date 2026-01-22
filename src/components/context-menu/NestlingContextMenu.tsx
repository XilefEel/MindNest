import * as ContextMenu from "@radix-ui/react-context-menu";
import { Edit3, Trash2, Copy, Archive, Pin, PinOff } from "lucide-react";
import DeleteModal from "../modals/DeleteModal";
import ContextMenuItem from "./ContextMenuItem";
import BaseContextMenu from "./BaseContextMenu";
import { useNestlingActions, useNestlings } from "@/stores/useNestlingStore";
import { toast } from "sonner";

export default function NestlingContextMenu({
  nestlingId,
  handleRename,
  children,
}: {
  nestlingId: number;
  handleRename?: () => void;
  children: React.ReactNode;
}) {
  const nestlings = useNestlings();
  const { duplicateNestling, updateNestling } = useNestlingActions();

  const nestling = nestlings.find((n) => n.id === nestlingId);
  if (!nestling) return null;

  const isPinned = nestling.isPinned;

  const handlePinNestling = () => {
    try {
      updateNestling(nestlingId, {
        isPinned: !isPinned,
      });
    } catch (error) {
      toast.error("Failed to pin nestling");
      console.error(error);
    }
  };

  return (
    <BaseContextMenu
      content={
        <>
          <ContextMenuItem Icon={Edit3} text="Rename" action={handleRename} />

          <ContextMenuItem
            Icon={Copy}
            text="Duplicate"
            action={() => duplicateNestling(nestlingId)}
          />

          <ContextMenuItem
            Icon={isPinned ? PinOff : Pin}
            text={isPinned ? "Unpin" : "Pin"}
            action={handlePinNestling}
          />

          <ContextMenu.Separator className="mx-2 my-1 h-px bg-gray-200 dark:bg-gray-700" />

          <ContextMenuItem
            Icon={Archive}
            text="Archive"
            action={() => console.log("Archive", nestlingId)}
          />

          <DeleteModal type="nestling" nestlingId={nestlingId}>
            {/* Using ContextMenu.Item instead of ContextMenuItem
              because modal triggers don't work with custom ContextMenuItem component*/}
            <ContextMenu.Item
              className="mx-1 flex cursor-pointer items-center gap-3 rounded px-3 py-2 text-sm text-red-600 transition-colors duration-200 outline-none hover:bg-red-100/40 dark:text-red-400 dark:hover:bg-red-800/40"
              onSelect={(e) => {
                e.preventDefault();
                console.log("Delete", nestlingId);
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
