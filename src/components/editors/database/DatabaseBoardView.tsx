import {
  useBoardGroups,
  useDbActions,
  useDbBoardGroupColumnId,
  useDbColumns,
} from "@/stores/useDatabaseStore";
import DbBoardColumn from "./board-view/DbBoardColumn";
import { useEffect } from "react";

export default function DatabaseBoardView() {
  const groups = useBoardGroups();
  const columns = useDbColumns();

  const boardGroupColumnId = useDbBoardGroupColumnId();

  const { setBoardGroupColumn } = useDbActions();

  useEffect(() => {
    const firstSelect = columns.find((c) => c.columnType === "select");
    if (firstSelect) setBoardGroupColumn(firstSelect.id);
  }, [boardGroupColumnId]);

  if (groups.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-zinc-400 dark:text-zinc-500">
        Add a select column to use board view
      </div>
    );
  }

  return (
    <div className="flex h-full flex-row items-start gap-4 overflow-x-auto pt-2">
      {groups.map((group) => (
        <DbBoardColumn key={group.option?.id ?? "no-value"} group={group} />
      ))}
    </div>
  );
}
