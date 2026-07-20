import { DbRowData } from "@/lib/types/database";
import { getCardTitleColumn } from "@/lib/utils/database";
import { cn } from "@/lib/utils/general";
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

  const { ref, isDragging } = useSortable({
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
      className={cn(
        "group cursor-grab rounded-lg border border-zinc-200 bg-white px-3 py-2.5 transition-all active:cursor-grabbing dark:border-zinc-700 dark:bg-zinc-800",
        isDragging
          ? "opacity-50"
          : "hover:border-zinc-300 dark:hover:border-zinc-600",
      )}
    >
      <h3 className="text-sm leading-snug font-medium text-zinc-800 dark:text-zinc-200">
        {title}
      </h3>
    </div>
  );
}
