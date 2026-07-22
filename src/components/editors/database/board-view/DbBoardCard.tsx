import BasePopover from "@/components/popovers/BasePopover";
import { DbCell, DbColumn, DbRowData } from "@/lib/types/database";
import {
  COLUMN_TYPES,
  getCardFields,
  getCardTitleColumn,
} from "@/lib/utils/database";
import { cn } from "@/lib/utils/general";
import { useDbColumns } from "@/stores/useDatabaseStore";
import { useSortable } from "@dnd-kit/react/sortable";
import { format } from "date-fns";
import { Check, X } from "lucide-react";

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
  const cardFieldColumns = getCardFields(columns, titleColumn?.id ?? -1);

  return (
    <BasePopover
      align="start"
      side="right"
      width="w-96"
      trigger={
        <div
          ref={ref}
          className={cn(
            "group cursor-grab rounded-lg border border-zinc-200 bg-white px-3 py-2.5 transition-colors hover:border-zinc-300 active:cursor-grabbing dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-600",
            isDragging && "opacity-50",
          )}
        >
          <h3 className="text-sm leading-snug font-medium text-zinc-800 dark:text-zinc-200">
            {title}
          </h3>
        </div>
      }
      content={
        <div className="flex flex-col gap-2">
          <h1 className="truncate text-sm font-medium text-zinc-800 dark:text-zinc-200">
            {title}
          </h1>

          {cardFieldColumns.length > 0 ? (
            <div className="flex flex-col gap-1.5 border-t border-zinc-200 pt-2 dark:border-zinc-700">
              {cardFieldColumns.map((col) => {
                const cell = rowData.cells.find((c) => c.columnId === col.id);
                return <CardFieldRow key={col.id} column={col} cell={cell} />;
              })}
            </div>
          ) : (
            <p className="text-sm text-zinc-400 dark:text-zinc-500">
              No additional fields
            </p>
          )}

          <div className="flex items-center justify-between gap-3 border-t border-zinc-200 pt-2 dark:border-zinc-700">
            <span className="truncate text-sm text-zinc-400 dark:text-zinc-500">
              Last updated
            </span>

            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              {format(new Date(rowData.row.updatedAt), "MMM d, yyyy")}
            </span>
          </div>
        </div>
      }
    />
  );
}

const CardFieldRow = ({
  column,
  cell,
}: {
  column: DbColumn;
  cell: DbCell | undefined;
}) => {
  const Icon = COLUMN_TYPES[column.columnType].Icon;

  const renderValue = () => {
    if (!cell?.value) {
      return (
        <span className="text-sm text-zinc-300 dark:text-zinc-600">—</span>
      );
    }

    switch (column.columnType) {
      case "checkbox":
        return cell.value === "true" ? (
          <Check className="size-3.5 text-teal-500" />
        ) : (
          <X className="size-3.5 text-zinc-300 dark:text-zinc-600" />
        );

      case "date":
        return (
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            {format(new Date(cell.value), "MMM d")}
          </span>
        );

      case "number":
        return (
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            {cell.value}
          </span>
        );

      default:
        return (
          <span className="max-w-48 truncate text-sm text-zinc-500 dark:text-zinc-400">
            {cell.value}
          </span>
        );
    }
  };

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-500">
        <Icon className="size-4 shrink-0" />
        <span className="truncate text-sm">{column.name}</span>
      </div>

      <div className="shrink-0">{renderValue()}</div>
    </div>
  );
};
