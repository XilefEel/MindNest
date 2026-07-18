import { DbRowData } from "@/lib/types/database";
import { getCardTitleColumn } from "@/lib/utils/database";
import { useDbColumns } from "@/stores/useDatabaseStore";

export default function DbBoardCard({ rowData }: { rowData: DbRowData }) {
  const columns = useDbColumns();
  const titleColumn = getCardTitleColumn(columns);

  const titleCell = titleColumn
    ? rowData.cells.find((c) => c.columnId === titleColumn.id)
    : null;

  const title = titleCell?.value?.trim() || "Untitled";

  return (
    <div className="rounded-md bg-white p-2 shadow-sm dark:bg-zinc-800">
      <h3 className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
        {title}
      </h3>
    </div>
  );
}
