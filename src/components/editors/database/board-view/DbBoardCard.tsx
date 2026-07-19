import { DbRowData } from "@/lib/types/database";
import { getCardTitleColumn } from "@/lib/utils/database";
import { useDbColumns } from "@/stores/useDatabaseStore";
import { useSortable } from "@dnd-kit/react/sortable";

export default function DbBoardCard({
  rowData,
  index,
  groupKey,
}: {
  rowData: DbRowData;
  index: number;
  groupKey: string;
}) {
  const columns = useDbColumns();
  const titleColumn = getCardTitleColumn(columns);

  const { ref } = useSortable({
    id: rowData.row.id,
    group: groupKey,
    accept: "card",
    type: "card",
    index,
    data: { group: groupKey },
  });

  const titleCell = titleColumn
    ? rowData.cells.find((c) => c.columnId === titleColumn.id)
    : null;

  const title = titleCell?.value?.trim() || "Untitled";

  return (
    <div
      ref={ref}
      className="rounded-md bg-white p-2 shadow-sm dark:bg-zinc-800"
    >
      <h3 className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
        {title}
      </h3>
    </div>
  );
}
