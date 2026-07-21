import { useSortable } from "@dnd-kit/react/sortable";
import DbBoardCard from "./DbBoardCard";
import { DbRowData, DbSelectOption } from "@/lib/types/database";
import { CollisionPriority } from "@dnd-kit/abstract";

export default function DbBoardColumn({
  option,
  rows,
  index,
}: {
  option: DbSelectOption | null;
  rows: DbRowData[];
  index: number;
}) {
  const { ref } = useSortable({
    id: option?.id ?? "no-option",
    accept: ["column", "card"],
    collisionPriority: CollisionPriority.Low,
    type: "column",
    index,
    disabled: option === null ? { draggable: true, droppable: false } : false,
  });

  const laneColor = option?.color ?? "#a1a1aa";
  const laneLabel = option?.label ?? "No option";

  return (
    <div
      ref={ref}
      style={{ backgroundColor: `${laneColor}20` }}
      className="flex w-72 shrink-0 flex-col overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50/60 dark:border-zinc-800 dark:bg-zinc-900/40"
    >
      <div className="flex items-center gap-2 px-3 py-3">
        <span
          style={{ backgroundColor: laneColor }}
          className="size-2 shrink-0 rounded-full"
        />

        <h3 className="flex-1 truncate text-sm font-semibold tracking-tight text-zinc-700 dark:text-zinc-200">
          {laneLabel}
        </h3>

        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-zinc-200/70 px-1.5 text-[11px] font-medium text-zinc-500 tabular-nums dark:bg-zinc-800 dark:text-zinc-400">
          {rows.length}
        </span>
      </div>

      <div style={{ backgroundColor: laneColor }} className="h-0.5 w-full" />

      <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-2">
        {rows.length > 0 ? (
          rows.map((rowData, i) => (
            <DbBoardCard
              key={rowData.row.id}
              rowData={rowData}
              index={i}
              groupKey={String(option?.id ?? "no-option")}
            />
          ))
        ) : (
          <div className="flex min-h-20 items-center justify-center rounded-lg border border-dashed border-zinc-300 text-xs text-zinc-400 dark:border-zinc-700 dark:text-zinc-600">
            No rows
          </div>
        )}
      </div>
    </div>
  );
}
