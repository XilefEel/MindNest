import BaseTooltip from "@/components/BaseTooltip";
import IconButton from "@/components/ui/icon-button";
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
import { ArrowDownUp, Filter, Search, SquareKanban, Table } from "lucide-react";

export default function DatabaseToolbar() {
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
              <IconButton
                label="Filter"
                onClick={() => {}}
                Icon={Filter}
                className={cn(
                  "p-1",
                  filters.length > 0 && "text-teal-500 dark:text-teal-400",
                )}
              />
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
              <IconButton
                label="Sort"
                onClick={() => {}}
                Icon={ArrowDownUp}
                className={cn(
                  "p-1",
                  sortColumnId && "text-teal-500 dark:text-teal-400",
                )}
              />
            </div>
          }
          content={<DatabaseSortPopover />}
        />

        <div className="flex items-center justify-center">
          <BaseTooltip label="Search">
            <IconButton
              label="Search"
              onClick={() => {}}
              Icon={Search}
              className={cn(
                "p-1",
                sortColumnId && "text-teal-500 dark:text-teal-400",
              )}
            />
          </BaseTooltip>
        </div>
      </div>
    </div>
  );
}
