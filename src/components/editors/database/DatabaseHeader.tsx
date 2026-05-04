import { useState } from "react";
import { TableHead } from "@/components/ui/table";
import { useDbActions } from "@/stores/useDatabaseStore";
import { DbColumn } from "@/lib/types/database";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  ClockPlus,
  Hash,
  SquareCheckBig,
  Trash2,
  Type,
} from "lucide-react";
import { cn } from "@/lib/utils/general";
import BasePopover from "@/components/popovers/BasePopover";
import { useActiveBackgroundId } from "@/stores/useNestStore";

const COLUMN_TYPES = [
  { value: "text", label: "Text", Icon: Type },
  { value: "number", label: "Number", Icon: Hash },
  { value: "checkbox", label: "Checkbox", Icon: SquareCheckBig },
  { value: "date", label: "Date", Icon: Calendar },
  { value: "created_at", label: "Created at", Icon: Clock },
  { value: "last_modified", label: "Last modified", Icon: ClockPlus },
];

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
  const [name, setName] = useState(column.name);
  const { updateColumn, deleteColumn } = useDbActions();
  const activeBackgroundId = useActiveBackgroundId();

  const handleRename = () => {
    if (name.trim() && name !== column.name) {
      updateColumn(column.id, name.trim(), column.orderIndex);
    }
  };

  const handleTypeChange = () => {
    updateColumn(column.id, column.name, column.orderIndex);
  };

  const handleMoveLeft = () => {
    updateColumn(column.id, column.name, column.orderIndex - 1);
  };

  const handleMoveRight = () => {
    updateColumn(column.id, column.name, column.orderIndex + 1);
  };

  return (
    <TableHead className="border-border w-48 border-x border-gray-300 dark:border-zinc-600">
      <BasePopover
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        width="w-60"
        trigger={
          <button className="flex w-full items-center gap-2 text-left text-sm font-medium">
            <Type className="size-4 flex-shrink-0 text-gray-800 dark:text-zinc-100" />{" "}
            {column.name}
          </button>
        }
        content={
          <div className="flex flex-col text-gray-900 dark:text-zinc-100">
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
                "mb-3 w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-sm shadow-sm focus:ring-2 focus:ring-teal-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-gray-400 dark:focus:ring-teal-400",
                activeBackgroundId &&
                  "border-transparent bg-white/10 backdrop-blur-sm dark:border-transparent dark:bg-black/10",
              )}
            />

            <div className="mb-1 border-b border-gray-200 pb-1">
              <p className="text-muted-foreground mb-1 px-2 text-xs">
                Field type
              </p>

              {COLUMN_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => handleTypeChange()}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-gray-50 dark:hover:bg-zinc-700/50",
                    column.columnType === type.value &&
                      "bg-teal-50 font-medium text-teal-600 dark:bg-zinc-700 dark:text-zinc-300",
                  )}
                >
                  <type.Icon
                    className={cn(
                      "size-4 flex-shrink-0 text-gray-600 dark:text-zinc-300",
                      column.columnType === type.value &&
                        "text-teal-600 dark:text-zinc-300",
                    )}
                  />
                  {type.label}
                </button>
              ))}
            </div>

            <div className="mb-1 border-b border-gray-200 pb-1">
              <button
                disabled={isFirst}
                onClick={handleMoveLeft}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-gray-50 disabled:opacity-40 dark:hover:bg-zinc-700/50"
              >
                <ChevronLeft className="size-4 flex-shrink-0 text-gray-600 dark:text-zinc-300" />
                Move left
              </button>

              <button
                disabled={isLast}
                onClick={handleMoveRight}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-gray-50 disabled:opacity-40 dark:hover:bg-zinc-700/50"
              >
                <ChevronRight className="size-4 flex-shrink-0 text-gray-600 dark:text-zinc-300" />
                Move right
              </button>
            </div>

            <button
              onClick={() => {
                deleteColumn(column.id);
                setIsOpen(false);
              }}
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-red-600 transition-colors hover:bg-red-300/30 dark:text-red-400 dark:hover:bg-red-800/30"
            >
              <Trash2 className="size-4" /> Delete
            </button>
          </div>
        }
      />
    </TableHead>
  );
}
