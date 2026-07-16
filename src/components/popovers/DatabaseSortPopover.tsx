import { COLUMN_TYPES } from "@/lib/utils/database";
import { cn } from "@/lib/utils/general";
import {
  useDbColumns,
  useDbActions,
  useSortColumnId,
  useSortDirection,
} from "@/stores/useDatabaseStore";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import { X, ArrowUp, ArrowDown } from "lucide-react";

export default function DatabaseSortPopover() {
  const columns = useDbColumns();
  const { setSort } = useDbActions();
  const sortColumnId = useSortColumnId();
  const sortDirection = useSortDirection();
  const activeBackgroundId = useActiveBackgroundId();

  return (
    <div className="flex flex-col gap-0.5 text-zinc-800 dark:text-zinc-200">
      {sortColumnId && (
        <button
          onClick={() => setSort(null, "asc")}
          className="flex items-center gap-1.5 px-2 py-1 text-xs text-zinc-500 transition-colors hover:text-red-500 dark:text-zinc-400 dark:hover:text-red-400"
        >
          <X className="size-3 shrink-0" />
          Clear sort
        </button>
      )}

      {columns.map((column) => {
        const isActive = sortColumnId === column.id;
        const Icon = COLUMN_TYPES[column.columnType].Icon;

        return (
          <button
            key={column.id}
            onClick={() =>
              setSort(
                column.id,
                isActive && sortDirection === "asc" ? "desc" : "asc",
              )
            }
            className={cn(
              "flex w-full items-center gap-2 rounded-md px-2 py-1 transition-[background]",
              activeBackgroundId
                ? isActive
                  ? "bg-teal-100/40 font-medium text-teal-600 dark:bg-teal-400/10 dark:text-teal-400"
                  : "hover:bg-black/5 dark:hover:bg-white/5"
                : isActive
                  ? "bg-teal-50 font-medium text-teal-600 dark:bg-teal-500/10 dark:text-teal-400"
                  : "hover:bg-zinc-50 dark:hover:bg-zinc-700/50",
            )}
          >
            <Icon className="size-4 shrink-0" />
            <span className="text-sm leading-tight">{column.name}</span>

            {isActive &&
              (sortDirection === "asc" ? (
                <ArrowUp className="ml-auto size-3.5 shrink-0" />
              ) : (
                <ArrowDown className="ml-auto size-3.5 shrink-0" />
              ))}
          </button>
        );
      })}
    </div>
  );
}
