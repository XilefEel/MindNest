import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { cn } from "@/lib/utils/general";
import { DbColumn, DbSelectOption } from "@/lib/types/database";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import BasePopover from "@/components/popovers/BasePopover";
import { COLORS } from "@/lib/utils/constants";
import { DragDropProvider } from "@dnd-kit/react";
import SelectOptionPill from "./SelectOptionPill";
import SelectCellRow from "./SelectCellRow";
import { useDbActions } from "@/stores/useDatabaseStore";

function pickNextColor(existing: DbSelectOption[]) {
  return COLORS[existing.length % COLORS.length];
}

export default function SelectCell({
  column,
  value,
  options,
  onSave,
  onCreateOption,
}: {
  column: DbColumn;
  value: string | null;
  options: DbSelectOption[];
  onSave: (value: string | null) => void;
  onCreateOption: (label: string, color: string) => Promise<DbSelectOption>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const activeBackgroundId = useActiveBackgroundId();
  const { reorderSelectOptions } = useDbActions();

  const selected = options.find((o) => String(o.id) === value) ?? null;

  const availableOptions = options.filter((o) =>
    o.label.toLowerCase().includes(searchQuery.trim().toLowerCase()),
  );

  const exactMatch = options.some(
    (o) => o.label.toLowerCase() === searchQuery.trim().toLowerCase(),
  );

  const handleSelect = (optionId: number) => {
    onSave(String(optionId) === value ? null : String(optionId));
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleCreateAndSelect = async () => {
    const label = searchQuery.trim();
    if (!label) return;
    const newOption = await onCreateOption(label, pickNextColor(options));
    handleSelect(newOption.id);
  };

  return (
    <BasePopover
      isOpen={isOpen}
      setIsOpen={(open) => {
        setIsOpen(open);
        if (!open) setSearchQuery("");
      }}
      align="start"
      width="w-64"
      trigger={
        <div>
          {selected ? (
            <SelectOptionPill option={selected} />
          ) : (
            <span
              className={cn(
                "text-zinc-400 dark:text-zinc-500",
                activeBackgroundId && "text-zinc-500 dark:text-zinc-400",
              )}
            >
              Empty
            </span>
          )}
        </div>
      }
      content={
        <>
          <div className="relative mb-3 w-full">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search or create a tag..."
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              className={cn(
                "w-full rounded-lg border py-1 pr-4 pl-9 text-sm shadow-sm transition",
                "dark:text-zinc-100 dark:placeholder-zinc-400",
                "bg-white dark:bg-zinc-800",
                "focus:ring-2 focus:ring-teal-500 focus:outline-none dark:focus:ring-teal-400",
                "border-zinc-300 dark:border-zinc-600",
                activeBackgroundId &&
                  "border-transparent bg-white/10 backdrop-blur-sm dark:border-transparent dark:bg-black/10",
              )}
            />
          </div>

          {availableOptions.length > 0 && (
            <DragDropProvider
              onDragEnd={(event) => {
                if (searchQuery) return;
                reorderSelectOptions(column.id, event);
              }}
            >
              <div className="flex flex-col">
                {availableOptions.map((option, index) => (
                  <SelectCellRow
                    key={option.id}
                    option={option}
                    selected={selected}
                    index={index}
                    handleSelect={handleSelect}
                  />
                ))}
              </div>
            </DragDropProvider>
          )}

          {!searchQuery && availableOptions.length === 0 && (
            <p className="py-2 text-xs text-zinc-700 dark:text-zinc-200">
              No available tags
            </p>
          )}

          {searchQuery && !exactMatch && (
            <button
              onClick={handleCreateAndSelect}
              className={cn(
                "flex w-full items-center gap-1 rounded-lg px-2 py-2 text-xs transition-colors",
                "text-zinc-700 dark:text-zinc-200",
                "hover:bg-zinc-50 dark:hover:bg-zinc-700/50",
              )}
            >
              <Plus className="size-4 shrink-0 text-zinc-700 dark:text-zinc-200" />
              Create "{searchQuery}"
            </button>
          )}
        </>
      }
    />
  );
}
