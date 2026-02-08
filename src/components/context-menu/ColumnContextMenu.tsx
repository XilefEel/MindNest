import { COLORS } from "@/lib/utils/constants";
import * as ContextMenu from "@radix-ui/react-context-menu";
import { Trash, Palette, Copy, Check } from "lucide-react";
import ContextMenuItem from "./ContextMenuItem";
import BaseContextMenu from "./BaseContextMenu";
import { BoardColumn } from "@/lib/types/board";
import { useBoardActions } from "@/stores/useBoardStore";
import { cn } from "@/lib/utils/general";
import { useActiveBackgroundId } from "@/stores/useNestStore";

export default function ColumnContextMenu({
  column,
  children,
}: {
  column: BoardColumn;
  children: React.ReactNode;
}) {
  const activeBackgroundId = useActiveBackgroundId();
  const { updateColumn, removeColumn, duplicateColumn } = useBoardActions();

  const handleDeleteColumn = async () => {
    try {
      await removeColumn(column.id);
    } catch (error) {
      console.error("Error deleting column:", error);
    }
  };

  const handleDuplicateColumn = async () => {
    try {
      await duplicateColumn(column);
    } catch (error) {
      console.error("Error duplicating column:", error);
    }
  };

  const handleEditColumn = async (color: string) => {
    try {
      await updateColumn(column.id, { color });
    } catch (error) {
      console.error("Failed to update node:", error);
    }
  };

  return (
    <BaseContextMenu
      content={
        <>
          <ContextMenuItem
            Icon={Copy}
            text="Duplicate Column"
            action={handleDuplicateColumn}
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
              <Palette className="h-4 w-4" />
              <span>Change Color</span>
              <div
                className="ml-auto h-3 w-3 rounded-full border border-gray-300 dark:border-gray-600"
                style={{ backgroundColor: column.color }}
              />
            </ContextMenu.SubTrigger>
            <ContextMenu.Portal>
              <ContextMenu.SubContent
                className={cn(
                  "animate-in fade-in-0 zoom-in-95 z-50 min-w-[160px] rounded-lg border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-800",
                  activeBackgroundId &&
                    "border-0 bg-white/30 backdrop-blur-sm hover:bg-white/30 dark:bg-black/30 dark:hover:bg-black/30",
                )}
              >
                <div className="grid grid-cols-4 gap-2">
                  {COLORS.map((color) => (
                    <button
                      key={color}
                      className="relative h-8 w-8 rounded-full border-2 border-gray-200 transition-all duration-200 hover:scale-110 dark:border-gray-600"
                      style={{ backgroundColor: color }}
                      title={color}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditColumn(color);
                      }}
                    >
                      {column.color === color && (
                        <Check className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow" />
                      )}
                    </button>
                  ))}
                </div>
              </ContextMenu.SubContent>
            </ContextMenu.Portal>
          </ContextMenu.Sub>

          <ContextMenu.Separator className="mx-2 my-1 h-px bg-gray-200 dark:bg-gray-700" />

          <ContextMenuItem
            Icon={Trash}
            text="Delete Column"
            isDelete
            action={handleDeleteColumn}
          />
        </>
      }
    >
      {children}
    </BaseContextMenu>
  );
}
