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
import TextCell from "./cells/TextCell";

export default function DatabaseEditor() {
  const activeNestling = useActiveNestling();
  if (!activeNestling) return null;

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
            {columns.map((col) => (
              <TableHead key={col.id} className="w-20 border-gray-300">
                {col.name}
              </TableHead>
            ))}
            <TableHead
              onClick={() => createColumn(activeNestling.id!, "Name", "text")}
              className="w-10 border-gray-300 text-gray-400"
            >
              <button>+ Add column</button>
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.map((rowData) => (
            <TableRow key={rowData.row.id} className="border-gray-300">
              {columns.map((col) => {
                const cell = rowData.cells.find((c) => c.columnId === col.id);
                return (
                  <TableCell key={col.id} className="border-gray-300">
                    <TextCell
                      value={cell?.value ?? null}
                      onSave={(value) =>
                        insertCell(rowData.row.id, col.id, value)
                      }
                    />
                  </TableCell>
                );
              })}
            </TableRow>
          ))}

          <TableRow>
            <TableCell
              colSpan={columns.length + 1}
              onClick={() => createRow(activeNestling.id!)}
              className="border-gray-300 text-gray-400"
            >
              <button>+ Add row</button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
