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
  useDbRows,
  useDbActions,
} from "@/stores/useDatabaseStore";
import DatabaseHeader from "./DatabaseHeader";
import DatabaseCell from "./DatabaseCell";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import { cn } from "@/lib/utils/general";

export default function DatabaseEditor() {
  const activeNestling = useActiveNestling();
  if (!activeNestling) return null;

  const activeBackgroundId = useActiveBackgroundId();

  const { updateNestling } = useNestlingActions();
  const [title, setTitle] = useState(activeNestling.title);
  const nestlingData = useMemo(() => ({ title }), [title]);
  useAutoSave(activeNestling.id!, nestlingData, updateNestling);

  const columns = useDbColumns();
  const rows = useDbRows();
  const { getDbData, createColumn, createRow, insertCell } = useDbActions();

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

      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col, index) => (
              <DatabaseHeader
                key={index}
                column={col}
                isFirst={index === 0}
                isLast={index === columns.length - 1}
              />
            ))}

            <TableHead
              onClick={() => createColumn(activeNestling.id!, "Name", "text")}
              className={cn(
                "w-5 border-gray-300 text-gray-400 transition-[background] hover:bg-gray-100 dark:border-zinc-600 dark:text-zinc-500 dark:hover:bg-zinc-800",
                activeBackgroundId &&
                  "border-black/30 text-gray-500 hover:bg-black/5 dark:border-white/30 dark:text-zinc-400 dark:hover:bg-white/5",
              )}
            >
              <button>+ Add column</button>
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.map((rowData) => (
            <TableRow
              key={rowData.row.id}
              className={cn(
                "border-gray-300 dark:border-zinc-600",
                activeBackgroundId && "border-black/30 dark:border-white/30",
              )}
            >
              {columns.map((col) => (
                <TableCell
                  key={col.id}
                  className={cn(
                    "border-gray-300 align-middle dark:border-zinc-600",
                    activeBackgroundId &&
                      "border-black/30 dark:border-white/30",
                  )}
                >
                  <DatabaseCell
                    column={col}
                    row={rowData.row}
                    cell={rowData.cells.find((c) => c.columnId === col.id)}
                    onSave={(value) =>
                      insertCell(rowData.row.id, col.id, value)
                    }
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}

          <TableRow>
            <TableCell
              colSpan={columns.length + 1}
              onClick={() => createRow(activeNestling.id!)}
              className={cn(
                "border-gray-300 text-gray-400 transition-[background] hover:bg-gray-100 dark:border-zinc-600 dark:text-zinc-500 dark:hover:bg-zinc-800",
                activeBackgroundId &&
                  "border-black/30 text-gray-600 hover:bg-black/5 dark:border-white/30 dark:text-zinc-300 dark:hover:bg-white/5",
              )}
            >
              <button>+ Add row</button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
