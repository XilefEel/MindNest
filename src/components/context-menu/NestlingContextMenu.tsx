import { Edit3, Trash2, Copy, Pin, PinOff } from "lucide-react";
import ContextMenuItem from "./ContextMenuItem";
import BaseContextMenu from "./BaseContextMenu";
import { useNestlingActions, useNestlings } from "@/stores/useNestlingStore";
import { toast } from "@/lib/utils/toast";
import { useDeleteModal } from "@/stores/useModalStore";
import ContextMenuSeperator from "./ContextMenuSeparator";

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

          <ContextMenuSeperator />

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
