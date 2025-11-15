import * as ContextMenu from "@radix-ui/react-context-menu";
import { Trash, Copy, CornerDownRight, Folder, Columns } from "lucide-react";
import ContextMenuItem from "./ContextMenuItem";
import BaseContextMenu from "./BaseContextMenu";
import { BoardCard } from "@/lib/types/board";
import { useBoardActions, useBoardData } from "@/stores/useBoardStore";
import { toast } from "sonner";
import { cn } from "@/lib/utils/general";
import { useActiveBackgroundId } from "@/stores/useNestStore";

export default function CardContextMenu({
  card,
  children,
}: {
  card: BoardCard;
  children: React.ReactNode;
}) {
  const boardData = useBoardData();
  const { deleteCard, duplicateCard, reorderCard } = useBoardActions();

  const activeBackgroundId = useActiveBackgroundId();
  if (!boardData) return null;

  const columns = boardData.columns;

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

  const handleMoveCard = async (targetColumnId: number) => {
    try {
      await reorderCard({
        activeCardId: card.id,
        targetCardId: null,
        targetColumnId: targetColumnId,
      });
    } catch (error) {
      toast.error("Failed to move card");
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

          <ContextMenu.Sub>
            <ContextMenu.SubTrigger
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className={cn(
                "mx-1 flex cursor-pointer items-center gap-3 rounded px-3 py-2 text-sm transition-colors outline-none hover:bg-gray-100 dark:hover:bg-gray-700",
                activeBackgroundId &&
                  "hover:bg-white/30 dark:hover:bg-black/30",
              )}
            >
              <CornerDownRight className="h-4 w-4" />
              <span>Move to Column</span>
            </ContextMenu.SubTrigger>

            <ContextMenu.Portal>
              <ContextMenu.SubContent
                className={cn(
                  "animate-in fade-in-0 zoom-in-95 z-50 min-w-[220px] rounded-lg border border-gray-200 bg-white py-2 shadow-lg dark:border-gray-700 dark:bg-gray-800",
                  activeBackgroundId &&
                    "border-0 bg-white/30 backdrop-blur-sm hover:bg-white/30 dark:bg-black/30 dark:hover:bg-black/30",
                )}
              >
                {columns.filter((column) => column.column.id !== card.columnId)
                  .length === 0 ? (
                  <ContextMenuItem
                    action={() => {}}
                    Icon={Folder}
                    text="No other columns"
                  />
                ) : (
                  columns
                    .filter((column) => column.column.id !== card.columnId)
                    .map((column) => (
                      <ContextMenuItem
                        key={column.column.id}
                        action={() => handleMoveCard(column.column.id)}
                        Icon={Columns}
                        text={column.column.title}
                      />
                    ))
                )}
              </ContextMenu.SubContent>
            </ContextMenu.Portal>
          </ContextMenu.Sub>

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
