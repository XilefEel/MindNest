import BaseToolTip from "@/components/BaseToolTip";
import BasePopover from "@/components/popovers/BasePopover";
import { COLUMN_TYPES } from "@/lib/utils/database";
import { cn } from "@/lib/utils/general";
import {
  useDbActions,
  useDbColumns,
  useSortColumnId,
  useSortDirection,
} from "@/stores/useDatabaseStore";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import { ArrowDown, ArrowDownUp, ArrowUp, Filter, X } from "lucide-react";

export default function DatabaseToolbar() {
  const activeBackgroundId = useActiveBackgroundId();
  const columns = useDbColumns();
  const { setSort } = useDbActions();

  const sortColumnId = useSortColumnId();
  const sortDirection = useSortDirection();

  return (
    <div className="flex flex-row justify-between px-4">
      <div></div>

      <div className="flex flex-row gap-1">
        <BasePopover
          width="w-60"
          side="left"
          trigger={
            <div>
              <BaseToolTip label="Filter">
                <button
                  className={cn(
                    "rounded-lg p-1 text-zinc-800 transition-colors dark:text-zinc-200",
                    "hover:text-teal-500 dark:hover:text-teal-400",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 dark:focus-visible:ring-teal-300",
                    activeBackgroundId &&
                      "hover:bg-black/5 dark:hover:bg-white/5",
                  )}
                >
                  <Filter className="size-4 shrink-0" />
                </button>
              </BaseToolTip>
            </div>
          }
          content={<></>}
        />

        <BasePopover
          width="w-60"
          side="left"
          trigger={
            <div>
              <BaseToolTip label="Sort">
                <button
                  className={cn(
                    "rounded-lg p-1 text-zinc-800 transition-colors dark:text-zinc-200",
                    "hover:text-teal-500 dark:hover:text-teal-400",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 dark:focus-visible:ring-teal-300",
                    activeBackgroundId &&
                      "hover:bg-black/5 dark:hover:bg-white/5",
                  )}
                >
                  <ArrowDownUp className="size-4 shrink-0" />
                </button>
              </BaseToolTip>
            </div>
          }
          content={
            <div className="flex flex-col gap-0.5">
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
                const currentType = COLUMN_TYPES.find(
                  (t) => t.value === column.columnType,
                );
                const HeaderIcon = currentType?.Icon ?? COLUMN_TYPES[0].Icon;

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
                      "flex w-full items-center gap-2 rounded px-2 py-1 text-sm transition-[background]",
                      activeBackgroundId
                        ? isActive
                          ? "bg-teal-100/40 font-medium text-teal-600 dark:bg-teal-400/10 dark:text-teal-400"
                          : "hover:bg-black/5 dark:hover:bg-white/5"
                        : isActive
                          ? "bg-teal-50 font-medium text-teal-600 dark:bg-teal-500/10 dark:text-teal-400"
                          : "hover:bg-zinc-50 dark:hover:bg-zinc-700/50",
                    )}
                  >
                    <HeaderIcon className="size-4 shrink-0 text-zinc-600 dark:text-zinc-300" />

                    <span>{column.name}</span>

                    {isActive &&
                      (sortDirection === "asc" ? (
                        <ArrowUp className="size-3.5 shrink-0" />
                      ) : (
                        <ArrowDown className="size-3.5 shrink-0" />
                      ))}
                  </button>
                );
              })}
            </div>
          }
        />
      </div>
    </div>
  );
}
