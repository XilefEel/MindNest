import { useState } from "react";
import { TableHead } from "@/components/ui/table";
import { DbColumn } from "@/lib/types/database";
import { cn } from "@/lib/utils/general";
import BasePopover from "@/components/popovers/BasePopover";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import DatabasePopover from "@/components/popovers/DatabasePopover";
import { COLUMN_TYPES } from "@/lib/utils/database";

export default function DatabaseHead({
  column,
  isFirst,
  isLast,
}: {
  column: DbColumn;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const activeBackgroundId = useActiveBackgroundId();

  const HeaderIcon = COLUMN_TYPES[column.columnType].Icon;

  return (
    <TableHead
      className={cn(
        "border-border w-48 border-x border-zinc-300 p-0 transition-[background] hover:bg-zinc-100 dark:border-zinc-600 dark:hover:bg-zinc-800",
        isFirst && "border-l-0",
        activeBackgroundId &&
          "border-black/30 hover:bg-black/5 dark:border-white/30 dark:hover:bg-white/5",
      )}
    >
      <BasePopover
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        width="w-60"
        trigger={
          <button className="flex h-full w-full items-center gap-2 px-2 text-left text-sm font-medium">
            <HeaderIcon className="size-4 shrink-0 text-zinc-800 dark:text-zinc-100" />{" "}
            {column.name}
          </button>
        }
        content={
          <DatabasePopover
            column={column}
            isFirst={isFirst}
            isLast={isLast}
            setIsOpen={setIsOpen}
          />
        }
      />
    </TableHead>
  );
}
