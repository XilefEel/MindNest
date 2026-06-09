import { DbColumn } from "@/lib/types/database";
import { COLUMN_TYPES } from "@/lib/utils/database";
import { cn } from "@/lib/utils/general";
import { useDbActions } from "@/stores/useDatabaseStore";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { useState } from "react";

export default function DatabasePopover({
  column,
  isFirst,
  isLast,
  setIsOpen,
}: {
  column: DbColumn;
  isFirst: boolean;
  isLast: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  const [name, setName] = useState(column.name);

  const { updateColumn, moveColumn, deleteColumn } = useDbActions();
  const activeBackgroundId = useActiveBackgroundId();

  const handleRename = () => {
    if (name.trim() && name !== column.name) {
      updateColumn(column.id, { name: name.trim() });
      setIsOpen(false);
    }
  };

  const handleTypeChange = (type: string) => {
    updateColumn(column.id, { columnType: type });
    setIsOpen(false);
  };

  const handleMoveColumn = (direction: "left" | "right") => {
    moveColumn(column.id, direction);
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col text-zinc-800 dark:text-zinc-200">
      <input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={handleRename}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleRename();
          if (e.key === "Escape") setName(column.name);
        }}
        className={cn(
          "mb-3 w-full rounded-md border border-zinc-300 bg-white px-2 py-1 text-sm shadow-sm focus:ring-2 focus:ring-teal-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-400 dark:focus:ring-teal-400",
          activeBackgroundId &&
            "border-transparent bg-white/10 backdrop-blur-sm dark:border-transparent dark:bg-black/10",
        )}
      />

      <div className="mb-2 border-b border-zinc-200 pb-2 dark:border-zinc-700">
        <p className="mb-1 px-2 text-xs">Field type</p>

        <div className="flex flex-col gap-0.5">
          {COLUMN_TYPES.map((type) => (
            <button
              key={type.value}
              onClick={() => handleTypeChange(type.value)}
              className={cn(
                "flex w-full items-center gap-2 rounded-md px-2 py-1 text-sm transition-colors",
                activeBackgroundId
                  ? column.columnType === type.value
                    ? "bg-white/30 font-medium text-zinc-800 dark:bg-black/30 dark:text-zinc-100"
                    : "hover:bg-black/5 dark:hover:bg-white/5"
                  : column.columnType === type.value
                    ? "bg-teal-50 font-medium text-teal-600 dark:bg-zinc-700 dark:text-zinc-100"
                    : "hover:bg-zinc-50 dark:hover:bg-zinc-700/50",
              )}
            >
              <type.Icon
                className={cn(
                  "size-4 shrink-0 text-zinc-600 dark:text-zinc-300",
                  column.columnType === type.value &&
                    "text-teal-600 dark:text-zinc-300",
                )}
              />
              {type.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-2 flex flex-col gap-0.5 border-b border-zinc-200 pb-2 dark:border-zinc-700">
        <button
          disabled={isFirst}
          onClick={() => handleMoveColumn("left")}
          className={cn(
            "flex w-full items-center gap-2 rounded-md px-2 py-1 text-sm transition-colors hover:bg-zinc-50 disabled:opacity-40 dark:hover:bg-zinc-700/50",
            activeBackgroundId && "hover:bg-black/5 dark:hover:bg-white/5",
          )}
        >
          <ChevronLeft className="size-4 shrink-0 text-zinc-600 dark:text-zinc-300" />
          Move left
        </button>

        <button
          disabled={isLast}
          onClick={() => handleMoveColumn("right")}
          className={cn(
            "flex w-full items-center gap-2 rounded-md px-2 py-1 text-sm transition-colors hover:bg-zinc-50 disabled:opacity-40 dark:hover:bg-zinc-700/50",
            activeBackgroundId && "hover:bg-black/5 dark:hover:bg-white/5",
          )}
        >
          <ChevronRight className="size-4 shrink-0 text-zinc-600 dark:text-zinc-300" />
          Move right
        </button>
      </div>

      <button
        onClick={() => {
          deleteColumn(column.id);
          setIsOpen(false);
        }}
        className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-sm text-red-600 transition-colors hover:bg-red-300/30 dark:text-red-400 dark:hover:bg-red-800/30"
      >
        <Trash2 className="size-4" /> Delete
      </button>
    </div>
  );
}
