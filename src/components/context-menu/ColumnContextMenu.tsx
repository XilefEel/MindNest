import { Trash, Copy } from "lucide-react";
import ContextMenuItem from "./ContextMenuItem";
import BaseContextMenu from "./BaseContextMenu";
import { BoardColumn } from "@/lib/types/board";
import { useBoardActions } from "@/stores/useBoardStore";
import ContextMenuSeperator from "./ContextMenuSeparator";
import ColorPickerMenu from "./ColorPickerMenu";

export default function ColumnContextMenu({
  column,
  children,
}: {
  column: BoardColumn;
  children: React.ReactNode;
}) {
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

          <ColorPickerMenu
            element={column}
            handleChangeColor={handleEditColumn}
          />

          <ContextMenuSeperator />

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
