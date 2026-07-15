import BasePopover from "@/components/popovers/BasePopover";
import DatabaseRowPopover from "@/components/popovers/DatabaseRowPopover";
import { TableRow, TableCell } from "@/components/ui/table";
import { cn } from "@/lib/utils/general";
import { EllipsisVertical, GripVertical } from "lucide-react";
import DatabaseCell from "./DatabaseCell";
import { DbRowData } from "@/lib/types/database";
import {
  useDbActions,
  useDbColumns,
  useDbFilters,
  useSortColumnId,
} from "@/stores/useDatabaseStore";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import { useSortable } from "@dnd-kit/react/sortable";

export default function DatabaseRow({
  rowData,
  index,
}: {
  rowData: DbRowData;
  index: number;
}) {
  const columns = useDbColumns();
  const { insertCell } = useDbActions();
  const activeBackgroundId = useActiveBackgroundId();

  const sortColumnId = useSortColumnId();
  const filters = useDbFilters();

  const isDraggable = sortColumnId === null && filters.length === 0;

  const { ref, handleRef } = useSortable({
    id: rowData.row.id,
    index,
    disabled: !isDraggable,
  });

  return (
    <TableRow ref={ref} className="border-transparent">
      <TableCell className="group border-transparent p-0">
        <div className="flex w-10 shrink-0 items-center justify-center gap-1">
          <div
            ref={handleRef}
            className={cn(
              "flex size-5 cursor-grab items-center justify-center active:cursor-grabbing",
              !isDraggable && "pointer-events-none opacity-50 dark:opacity-50",
            )}
          >
            <GripVertical className="size-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
          </div>

          <BasePopover
            align="start"
            side="right"
            width="w-60"
            trigger={
              <button className="flex h-full w-full items-center justify-center">
                <EllipsisVertical className="size-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
              </button>
            }
            content={<DatabaseRowPopover rowData={rowData} index={index} />}
          />
        </div>
      </TableCell>

      {columns.map((col, index) => (
        <TableCell
          key={col.id}
          className={cn(
            "border-zinc-300 align-middle dark:border-zinc-600",
            index === 0 && "border-l-0",
            activeBackgroundId && "border-black/30 dark:border-white/30",
          )}
        >
          <DatabaseCell
            column={col}
            row={rowData.row}
            cell={rowData.cells.find((c) => c.columnId === col.id)}
            onSave={(value) => insertCell(rowData.row.id, col.id, value)}
          />
        </TableCell>
      ))}
    </TableRow>
  );
}
