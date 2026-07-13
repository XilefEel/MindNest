import { DbColumn, FilterCondition } from "@/lib/types/database";
import { COLUMN_TYPES } from "@/lib/utils/database";
import { cn } from "@/lib/utils/general";
import {
  useDbColumns,
  useDbFilters,
  useDbActions,
} from "@/stores/useDatabaseStore";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import { X } from "lucide-react";
import BaseSelectMenu from "../select/BaseSelectMenu";

export default function DatabaseFilterPopover() {
  const columns = useDbColumns();
  const filters = useDbFilters();
  const { addFilter, updateFilter, clearFilters, removeFilter } =
    useDbActions();
  const activeBackgroundId = useActiveBackgroundId();

  return (
    <div className="flex flex-col gap-1">
      {filters.length > 0 && (
        <button
          onClick={clearFilters}
          className="flex items-center gap-1.5 px-2 py-1 text-xs text-zinc-500 transition-colors hover:text-red-500 dark:text-zinc-400 dark:hover:text-red-400"
        >
          <X className="size-3 shrink-0" />
          Clear filters
        </button>
      )}

      {filters.map((filter) => {
        const column = columns.find((c) => c.id === filter.columnId);
        if (!column) return null;

        const Icon = COLUMN_TYPES[column.columnType].Icon;

        return (
          <div
            key={filter.id}
            className={cn(
              "flex w-full items-center gap-2 rounded px-2 py-1 text-sm",
              activeBackgroundId
                ? "hover:bg-black/5 dark:hover:bg-white/5"
                : "hover:bg-zinc-50 dark:hover:bg-zinc-700/50",
            )}
          >
            <Icon className="size-4 shrink-0 text-zinc-600 dark:text-zinc-300" />
            <span className="mr-auto shrink-0">{column.name}</span>

            <FilterValueInput
              column={column}
              filter={filter}
              onChange={(value) => updateFilter(filter.id, value)}
            />

            <button
              onClick={() => removeFilter(filter.id)}
              className="shrink-0"
            >
              <X className="size-3.5 text-zinc-400 hover:text-red-500 dark:text-zinc-500 dark:hover:text-red-400" />
            </button>
          </div>
        );
      })}

      {filters.length > 0 && (
        <div className="border-t border-zinc-200 dark:border-zinc-700" />
      )}

      {columns
        .filter((col) => !filters.some((f) => f.columnId === col.id))
        .map((column) => {
          const Icon = COLUMN_TYPES[column.columnType].Icon;

          return (
            <button
              key={column.id}
              onClick={() => addFilter(column.id)}
              className={cn(
                "flex w-full items-center gap-2 rounded px-2 py-1 text-sm text-zinc-500 transition-[background] dark:text-zinc-400",
                activeBackgroundId
                  ? "hover:bg-black/5 dark:hover:bg-white/5"
                  : "hover:bg-zinc-50 dark:hover:bg-zinc-700/50",
              )}
            >
              <Icon className="size-4 shrink-0" />
              <span>{column.name}</span>
            </button>
          );
        })}
    </div>
  );
}

function FilterValueInput({
  column,
  filter,
  onChange,
}: {
  column: DbColumn;
  filter: FilterCondition;
  onChange: (value: string) => void;
}) {
  switch (column.columnType) {
    case "checkbox":
      return (
        <BaseSelectMenu
          value={filter.value}
          onChange={onChange}
          options={[
            { value: "true", label: "Checked" },
            { value: "false", label: "Unchecked" },
          ]}
          size="text-xs"
        />
      );

    case "select":
      return (
        <BaseSelectMenu
          value={filter.value}
          onChange={onChange}
          options={[
            { value: "__any__", label: "Any" },
            ...column.options.map((opt) => ({
              value: String(opt.id),
              label: opt.label,
            })),
          ]}
          size="text-xs"
        />
      );

    // text, number, date, created_at, last_modified
    default:
      return (
        <input
          value={filter.value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Value..."
          className="ml-auto w-20 rounded border-none bg-transparent text-xs text-zinc-500 focus:outline-none dark:text-zinc-400"
        />
      );
  }
}
