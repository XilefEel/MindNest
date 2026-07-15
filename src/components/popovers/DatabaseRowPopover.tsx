import { DbRowData } from "@/lib/types/database";
import { cn } from "@/lib/utils/general";
import {
  useDbActions,
  useDbFilters,
  useDbRows,
  useSortColumnId,
} from "@/stores/useDatabaseStore";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import { ArrowDown, ArrowUp, Copy, Plus, Trash2 } from "lucide-react";

export default function DatabaseRowPopover({
  rowData,
  index,
}: {
  rowData: DbRowData;
  index: number;
}) {
  const { deleteRow, moveRow, addRowBelow, duplicateRow } = useDbActions();
  const activeBackgroundId = useActiveBackgroundId();
  const sortColumnId = useSortColumnId();
  const filters = useDbFilters();
  const rows = useDbRows();

  const isDraggable = sortColumnId === null && filters.length === 0;

  return (
    <div className="flex flex-col gap-0.5 text-zinc-800 dark:text-zinc-200">
      <button
        onClick={() => moveRow(rowData.row.id, "up")}
        disabled={!isDraggable || index === 0}
        className={cn(
          "flex w-full items-center gap-2 rounded-md px-2 py-1 text-sm transition-colors hover:bg-zinc-50 disabled:opacity-40 dark:hover:bg-zinc-700/50",
          "disabled:opacity-50 disabled:hover:bg-transparent dark:disabled:opacity-50 dark:disabled:hover:bg-transparent",
          activeBackgroundId && "hover:bg-black/5 dark:hover:bg-white/5",
        )}
      >
        <ArrowUp className="size-4 shrink-0 text-zinc-600 dark:text-zinc-300" />
        Move up
      </button>

      <button
        onClick={() => moveRow(rowData.row.id, "down")}
        disabled={!isDraggable || index === rows.length - 1}
        className={cn(
          "flex w-full items-center gap-2 rounded-md px-2 py-1 text-sm transition-colors hover:bg-zinc-50 disabled:opacity-40 dark:hover:bg-zinc-700/50",
          "disabled:opacity-50 disabled:hover:bg-transparent dark:disabled:opacity-50 dark:disabled:hover:bg-transparent",
          activeBackgroundId && "hover:bg-black/5 dark:hover:bg-white/5",
        )}
      >
        <ArrowDown className="size-4 shrink-0 text-zinc-600 dark:text-zinc-300" />
        Move down
      </button>

      <button
        onClick={() => addRowBelow(rowData.row.id)}
        disabled={!isDraggable}
        className={cn(
          "flex w-full items-center gap-2 rounded-md px-2 py-1 text-sm transition-colors hover:bg-zinc-50 disabled:opacity-40 dark:hover:bg-zinc-700/50",
          "disabled:opacity-50 disabled:hover:bg-transparent dark:disabled:opacity-50 dark:disabled:hover:bg-transparent",
          activeBackgroundId && "hover:bg-black/5 dark:hover:bg-white/5",
        )}
      >
        <Plus className="size-4 shrink-0 text-zinc-600 dark:text-zinc-300" />
        Insert row below
      </button>

      <button
        onClick={() => duplicateRow(rowData.row.id)}
        disabled={!isDraggable}
        className={cn(
          "flex w-full items-center gap-2 rounded-md px-2 py-1 text-sm transition-colors hover:bg-zinc-50 disabled:opacity-40 dark:hover:bg-zinc-700/50",
          "disabled:opacity-50 disabled:hover:bg-transparent dark:disabled:opacity-50 dark:disabled:hover:bg-transparent",
          activeBackgroundId && "hover:bg-black/5 dark:hover:bg-white/5",
        )}
      >
        <Copy className="size-4 shrink-0 text-zinc-600 dark:text-zinc-300" />
        Duplicate row
      </button>

      <div className="my-1 border-b border-zinc-200 dark:border-zinc-700" />

      <button
        onClick={() => deleteRow(rowData.row.id)}
        className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-sm text-red-600 transition-colors hover:bg-red-300/30 dark:text-red-400 dark:hover:bg-red-800/30"
      >
        <Trash2 className="size-4 shrink-0" />
        Delete row
      </button>
    </div>
  );
}
