import * as ContextMenu from "@radix-ui/react-context-menu";
import { Trash, Copy, CornerDownRight } from "lucide-react";
import ContextMenuItem from "./ContextMenuItem";
import BaseContextMenu from "./BaseContextMenu";
import { BoardCard } from "@/lib/types/board";
import { useBoardStore } from "@/stores/useBoardStore";

export default function CardContextMenu({
  card,
  children,
}: {
  card: BoardCard;
  children: React.ReactNode;
}) {
  const { removeCard, duplicateCard } = useBoardStore();
  const handleDeleteCard = async () => {
    try {
      await removeCard(card.id);
    } catch (error) {}
  };

  const handleDuplicateCard = async () => {
    try {
      await duplicateCard(card);
    } catch (error) {
      console.log("error", error);
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

          <ContextMenuItem
            Icon={CornerDownRight}
            text="Move Card"
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
