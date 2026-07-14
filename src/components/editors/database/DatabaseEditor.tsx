import useAutoSave from "@/hooks/useAutoSave";
import {
  useActiveNestling,
  useNestlingActions,
} from "@/stores/useNestlingStore";
import { useState, useMemo, useEffect } from "react";
import NestlingTitle from "../NestlingTitle";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import {
  useDbColumns,
  useDbActions,
  useVisibleDbRows,
} from "@/stores/useDatabaseStore";
import DatabaseHeader from "./DatabaseHeader";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import { cn } from "@/lib/utils/general";
import { Plus } from "lucide-react";
import DatabaseToolbar from "./DatabaseToolbar";
import { ColumnType } from "@/lib/types/database";
import DatabaseRow from "./DatabaseRow";
import { DragDropProvider } from "@dnd-kit/react";

export default function DatabaseEditor() {
  const activeNestling = useActiveNestling();
  if (!activeNestling) return null;

  const activeBackgroundId = useActiveBackgroundId();

  const { updateNestling } = useNestlingActions();
  const [title, setTitle] = useState(activeNestling.title);
  const nestlingData = useMemo(() => ({ title }), [title]);
  useAutoSave(activeNestling.id!, nestlingData, updateNestling);

  const columns = useDbColumns();
  const rows = useVisibleDbRows();
  const { getDbData, createColumn, createRow, handleRowDragEnd } =
    useDbActions();

  useEffect(() => {
    getDbData(activeNestling.id!);
  }, [activeNestling.id]);

  return (
    <div className="flex flex-col gap-4">
      <NestlingTitle
        title={title}
        setTitle={setTitle}
        nestling={activeNestling}
      />

      <div>
        <DatabaseToolbar />

        <Table className="min-w-max">
          <TableHeader>
            <TableRow>
              <TableHead className="border-transparent" />

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
                <DatabaseRow
                  key={rowData.row.id}
                  rowData={rowData}
                  index={index}
                />
              ))}

              <TableRow>
                <TableCell className="border-transparent" />

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
      </div>
    </div>
  );
}
