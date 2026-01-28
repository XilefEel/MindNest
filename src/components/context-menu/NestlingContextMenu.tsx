import * as ContextMenu from "@radix-ui/react-context-menu";
import { Edit3, Trash2, Copy, Archive, Pin, PinOff } from "lucide-react";
import ContextMenuItem from "./ContextMenuItem";
import BaseContextMenu from "./BaseContextMenu";
import { useNestlingActions, useNestlings } from "@/stores/useNestlingStore";
import { toast } from "sonner";
import { useDeleteModal } from "@/stores/useModalStore";

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
  const { setDeleteTarget } = useDeleteModal();

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
          <ContextMenuItem Icon={Edit3} text="Rename" action={handleRename!} />

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

          <ContextMenuItem
            Icon={Trash2}
            text="Delete"
            isDelete
            action={() => {
              // setTimeout is REQUIRED for the modal to close properly
              // when called in context menu item
              setTimeout(() => setDeleteTarget("nestling", nestlingId), 0);
            }}
          />
        </>
      }
    >
      {children}
    </BaseContextMenu>
  );
}
