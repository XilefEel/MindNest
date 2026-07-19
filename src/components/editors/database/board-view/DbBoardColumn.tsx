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
    id: option?.id ?? "no-value",
    accept: ["column", "card"],
    collisionPriority: CollisionPriority.Low,
    type: "column",
    index,
    disabled: option === null,
  });

  const laneColor = option?.color ?? "#a1a1aa";
  const laneLabel = option?.label ?? "No value";

  return (
    <div
      ref={ref}
      style={{ backgroundColor: `${laneColor}30` }}
      className="flex w-72 shrink-0 flex-col overflow-hidden rounded-2xl border border-black/5 shadow-sm"
    >
      <div className="flex items-center gap-3 px-4 pt-2">
        <span
          style={{ backgroundColor: laneColor }}
          className="size-2.5 shrink-0 rounded-full"
        />

        <h3 className="flex-1 text-sm font-semibold text-zinc-700 dark:text-zinc-200">
          {laneLabel}
        </h3>

        <span className="flex size-6 items-center justify-center rounded-full bg-black/5 text-xs font-medium text-zinc-500 dark:bg-white/10 dark:text-zinc-400">
          {rows.length}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-2">
        {rows.length > 0 ? (
          rows.map((rowData, i) => (
            <DbBoardCard
              key={rowData.row.id}
              rowData={rowData}
              index={i}
              groupKey={String(option?.id ?? "no-value")}
            />
          ))
        ) : (
          <div className="flex min-h-20 items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 text-xs text-zinc-400 dark:border-zinc-600 dark:text-zinc-500">
            No rows
          </div>
        )}
      </div>
    </div>
  );
}
