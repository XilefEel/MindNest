import { useEffect } from "react";
import { DragDropProvider } from "@dnd-kit/react";
import {
  useDatabaseStore,
  useDbActions,
  useDbBoardGroups,
  useDbColumns,
} from "@/stores/useDatabaseStore";
import DbBoardColumn from "./board-view/DbBoardColumn";

export default function DatabaseBoardView() {
  const columns = useDbColumns();
  const boardGroupColumnId = useDatabaseStore((s) => s.boardGroupColumnId);
  const filters = useDatabaseStore((s) => s.filters);
  const sortColumnId = useDatabaseStore((s) => s.sortColumnId);
  const sortDirection = useDatabaseStore((s) => s.sortDirection);

  const {
    setBoardGroupColumn,
    computeBoardGroups,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  } = useDbActions();

  const groups = useDbBoardGroups();

  useEffect(() => {
    if (boardGroupColumnId === null) {
      const firstSelect = columns.find((c) => c.columnType === "select");
      if (firstSelect) setBoardGroupColumn(firstSelect.id);
    }
  }, [boardGroupColumnId]);

  useEffect(() => {
    computeBoardGroups();
  }, [boardGroupColumnId, filters, sortColumnId, sortDirection]);

  const groupColumn = columns.find((c) => c.id === boardGroupColumnId);

  if (!groupColumn) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-zinc-400 dark:text-zinc-500">
        Add a select column to use board view
      </div>
    );
  }

  const laneOptions = groupColumn.options.toSorted(
    (a, b) => a.orderIndex - b.orderIndex,
  );

  return (
    <DragDropProvider
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-full flex-row items-start gap-4 overflow-x-auto pt-2">
        {laneOptions.map((option, index) => (
          <DbBoardColumn
            key={option?.id ?? "no-value"}
            option={option}
            index={index}
            rows={groups[option ? String(option.id) : "no-value"] ?? []}
          />
        ))}
      </div>
    </DragDropProvider>
  );
}
