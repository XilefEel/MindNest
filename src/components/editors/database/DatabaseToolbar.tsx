import BaseToolTip from "@/components/BaseToolTip";
import BasePopover from "@/components/popovers/BasePopover";
import DatabaseFilterPopover from "@/components/popovers/DatabaseFilterPopover";
import DatabaseSortPopover from "@/components/popovers/DatabaseSortPopover";
import { cn } from "@/lib/utils/general";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import { ArrowDownUp, Filter } from "lucide-react";

export default function DatabaseToolbar() {
  const activeBackgroundId = useActiveBackgroundId();

  return (
    <div className="flex flex-row justify-between px-4">
      <div></div>

      <div className="flex flex-row gap-1">
        <BasePopover
          width="w-72"
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
          content={<DatabaseFilterPopover />}
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
          content={<DatabaseSortPopover />}
        />
      </div>
    </div>
  );
}
