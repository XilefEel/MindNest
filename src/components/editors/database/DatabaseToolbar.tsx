import BaseToolTip from "@/components/BaseToolTip";
import BasePopover from "@/components/popovers/BasePopover";
import DatabaseFilterPopover from "@/components/popovers/DatabaseFilterPopover";
import DatabaseSortPopover from "@/components/popovers/DatabaseSortPopover";
import { cn } from "@/lib/utils/general";
import {
  useSortColumnId,
  useDbFilters,
  useDbViewMode,
  useDbActions,
} from "@/stores/useDatabaseStore";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import { ArrowDownUp, Filter, Search, SquareKanban, Table } from "lucide-react";

export default function DatabaseToolbar() {
  const activeBackgroundId = useActiveBackgroundId();
  const sortColumnId = useSortColumnId();
  const filters = useDbFilters();

  const viewMode = useDbViewMode();
  const { setViewMode } = useDbActions();

  return (
    <div className="flex flex-row justify-between pr-4 pl-14">
      <div className="flex items-center gap-1">
        <button
          onClick={() => setViewMode("table")}
          className={cn(
            "flex items-center gap-2 rounded-t-md border-b-2 px-3 py-1 text-sm transition-colors",
            viewMode === "table"
              ? "border-teal-500 text-zinc-800 dark:text-zinc-100"
              : "border-transparent text-zinc-600 hover:bg-zinc-100 hover:text-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700/50 dark:hover:text-zinc-100",
          )}
        >
          <Table className="size-4 shrink-0" />
          Table
        </button>

        <button
          onClick={() => setViewMode("board")}
          className={cn(
            "flex items-center gap-2 rounded-t-md border-b-2 px-3 py-1 text-sm transition-colors",
            viewMode === "board"
              ? "border-teal-500 text-zinc-800 dark:text-zinc-100"
              : "border-transparent text-zinc-600 hover:bg-zinc-100 hover:text-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700/50 dark:hover:text-zinc-100",
          )}
        >
          <SquareKanban className="size-4 shrink-0" />
          Board
        </button>
      </div>

      <div className="flex flex-row gap-1">
        <BasePopover
          side="left"
          padding="p-2"
          trigger={
            <div className="flex items-center justify-center">
              <BaseToolTip label="Filter">
                <button
                  className={cn(
                    "rounded-lg p-1 text-zinc-800 transition-colors dark:text-zinc-200",
                    "hover:text-teal-500 dark:hover:text-teal-400",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 dark:focus-visible:ring-teal-300",
                    activeBackgroundId &&
                      "hover:bg-black/5 dark:hover:bg-white/5",
                    filters.length > 0 && "text-teal-500 dark:text-teal-400",
                  )}
                >
                  <Filter className="size-4 shrink-0" />
                </button>
              </BaseToolTip>
            </div>
          }
          content={<DatabaseFilterPopover />}
        />

        <BasePopover
          width="w-60"
          padding="p-2"
          side="left"
          trigger={
            <div className="flex items-center justify-center">
              <BaseToolTip label="Sort">
                <button
                  className={cn(
                    "rounded-lg p-1 text-zinc-800 transition-colors dark:text-zinc-200",
                    "hover:text-teal-500 dark:hover:text-teal-400",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 dark:focus-visible:ring-teal-300",
                    activeBackgroundId &&
                      "hover:bg-black/5 dark:hover:bg-white/5",
                    sortColumnId && "text-teal-500 dark:text-teal-400",
                  )}
                >
                  <ArrowDownUp className="size-4 shrink-0" />
                </button>
              </BaseToolTip>
            </div>
          }
          content={<DatabaseSortPopover />}
        />

        <div className="flex items-center justify-center">
          <BaseToolTip label="Search">
            <button
              className={cn(
                "rounded-lg p-1 text-zinc-800 transition-colors dark:text-zinc-200",
                "hover:text-teal-500 dark:hover:text-teal-400",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 dark:focus-visible:ring-teal-300",
                activeBackgroundId && "hover:bg-black/5 dark:hover:bg-white/5",
                sortColumnId && "text-teal-500 dark:text-teal-400",
              )}
            >
              <Search className="size-4 shrink-0" />
            </button>
          </BaseToolTip>
        </div>
      </div>
    </div>
  );
}
