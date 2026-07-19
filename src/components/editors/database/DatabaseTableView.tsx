import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import DatabaseHeader from "./DatabaseHeader";
import { cn } from "@/lib/utils/general";
import { Plus } from "lucide-react";
import { ColumnType } from "@/lib/types/database";
import DatabaseRow from "./DatabaseRow";
import { DragDropProvider } from "@dnd-kit/react";
import {
  useDbColumns,
  useVisibleDbRows,
  useDbActions,
} from "@/stores/useDatabaseStore";
import { useActiveNestling } from "@/stores/useNestlingStore";
import { useActiveBackgroundId } from "@/stores/useNestStore";

export default function DatabaseTableView() {
  const activeNestling = useActiveNestling();
  if (!activeNestling) return null;

  const activeBackgroundId = useActiveBackgroundId();

  const columns = useDbColumns();
  const rows = useVisibleDbRows();
  const { createColumn, createRow, handleRowDragEnd } = useDbActions();

  return (
    <Table className="min-w-max">
      <TableHeader>
        <TableRow>
          <TableHead className="w-10 border-transparent" />

          {columns.map((col, index) => (
            <DatabaseHeader
              key={col.id}
              column={col}
              isFirst={index === 0}
              isLast={index === columns.length - 1}
            />
          ))}

          <TableHead
            onClick={() =>
              createColumn(activeNestling.id!, "Name", "text" as ColumnType)
            }
            className={cn(
              "border-zinc-300 text-zinc-400 transition-[background] hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-500 dark:hover:bg-zinc-800",
              activeBackgroundId &&
                "border-black/30 text-zinc-500 hover:bg-black/5 dark:border-white/30 dark:text-zinc-400 dark:hover:bg-white/5",
            )}
          >
            <button className="flex items-center gap-1">
              <Plus className="size-4 shrink-0" />
              New Column
            </button>
          </TableHead>
        </TableRow>
      </TableHeader>

      <DragDropProvider onDragEnd={(event) => handleRowDragEnd(event)}>
        <TableBody>
          {rows.map((rowData, index) => (
            <DatabaseRow key={rowData.row.id} rowData={rowData} index={index} />
          ))}

          <TableRow>
            <TableCell className="w-10 border-transparent" />

            <TableCell
              colSpan={columns.length + 1}
              onClick={() => createRow(activeNestling.id!)}
              className={cn(
                "border-l-0 border-zinc-300 text-zinc-400 transition-[background] hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-500 dark:hover:bg-zinc-800",
                activeBackgroundId &&
                  "border-black/30 text-zinc-600 hover:bg-black/5 dark:border-white/30 dark:text-zinc-300 dark:hover:bg-white/5",
              )}
            >
              <button className="flex items-center gap-1">
                <Plus className="size-4 shrink-0" />
                New row
              </button>
            </TableCell>
          </TableRow>
        </TableBody>
      </DragDropProvider>
    </Table>
  );
}
