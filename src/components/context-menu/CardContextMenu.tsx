import * as ContextMenu from "@radix-ui/react-context-menu";
import { Trash, Copy } from "lucide-react";
import ContextMenuItem from "./ContextMenuItem";
import BaseContextMenu from "./BaseContextMenu";
import { BoardCard } from "@/lib/types/board";
import { useBoardActions } from "@/stores/useBoardStore";
import { toast } from "sonner";

export default function CardContextMenu({
  card,
  children,
}: {
  card: BoardCard;
  children: React.ReactNode;
}) {
  const { deleteCard, duplicateCard } = useBoardActions();

  const handleDeleteCard = async () => {
    try {
      await deleteCard(card.id);
    } catch (error) {
      toast.error("Failed to delete card");
      console.error(error);
    }
  };

  const handleDuplicateCard = async () => {
    try {
      await duplicateCard(card);
    } catch (error) {
      toast.error("Failed to duplicate card");
      console.error(error);
    }
  };

  return (
    <BaseContextMenu
      content={
        <>
          <ContextMenuItem
            Icon={Copy}
            text="Duplicate Card"
            action={handleDuplicateCard}
          />

          <ContextMenu.Separator className="mx-2 my-1 h-px bg-gray-200 dark:bg-gray-700" />

          <ContextMenuItem
            Icon={Trash}
            text="Delete Card"
            isDelete
            action={handleDeleteCard}
          />
        </>
      }
    >
      {children}
    </BaseContextMenu>
  );
}
