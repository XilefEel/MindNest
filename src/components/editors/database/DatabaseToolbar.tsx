import BaseToolTip from "@/components/BaseToolTip";
import BasePopover from "@/components/popovers/BasePopover";
import { cn } from "@/lib/utils/general";
import { useDbActions, useDbColumns } from "@/stores/useDatabaseStore";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import { ArrowDown, ArrowDownUp, ArrowUp, Filter } from "lucide-react";

export default function DatabaseToolbar() {
  const activeBackgroundId = useActiveBackgroundId();
  const columns = useDbColumns();
  const { setSort } = useDbActions();

  return (
    <div className="flex flex-row justify-between px-4">
      <div></div>

      <div className="flex flex-row gap-1">
        <BasePopover
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
            <>
              {columns.map((column) => (
                <div
                  key={column.id}
                  className="flex flex-row items-center gap-2"
                >
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    {column.name}
                  </span>
                  <button
                    onClick={() => setSort(column.id, "asc")}
                    className="rounded-lg p-1 text-zinc-800 transition-colors hover:text-teal-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 dark:text-zinc-200 dark:hover:text-teal-400 dark:focus-visible:ring-teal-300"
                  >
                    <ArrowUp className="size-4 shrink-0" />
                  </button>
                  <button
                    onClick={() => setSort(column.id, "desc")}
                    className="rounded-lg p-1 text-zinc-800 transition-colors hover:text-teal-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 dark:text-zinc-200 dark:hover:text-teal-400 dark:focus-visible:ring-teal-300"
                  >
                    <ArrowDown className="size-4 shrink-0" />
                  </button>
                </div>
              ))}
            </>
          }
        />
      </div>
    </div>
  );
}
