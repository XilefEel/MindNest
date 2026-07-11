import { DbSelectOption } from "@/lib/types/database";
import { COLORS } from "@/lib/utils/constants";
import { cn } from "@/lib/utils/general";
import { useDbActions } from "@/stores/useDatabaseStore";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import { Check, Palette, Trash2 } from "lucide-react";
import { useState } from "react";

export default function EditOptionMenu({ option }: { option: DbSelectOption }) {
  const activeBackgroundId = useActiveBackgroundId();
  const [label, setLabel] = useState(option.label);
  const { updateSelectOption, deleteSelectOption } = useDbActions();

  const handleBlur = () => {
    const trimmed = label.trim();
    if (trimmed && trimmed !== option.label) {
      updateSelectOption(option.columnId, option.id, { label: trimmed });
    } else {
      setLabel(option.label);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <input
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={(e) => {
          if (e.key === "Enter") (e.target as HTMLInputElement).blur();
        }}
        autoFocus
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        className={cn(
          "w-full rounded-lg border px-3 py-1 text-sm shadow-sm transition",
          "dark:text-zinc-100 dark:placeholder-zinc-400",
          "bg-white dark:bg-zinc-800",
          "focus:ring-2 focus:ring-teal-500 focus:outline-none dark:focus:ring-teal-400",
          "border-zinc-300 dark:border-zinc-600",
          activeBackgroundId &&
            "border-transparent bg-white/10 backdrop-blur-sm dark:border-transparent dark:bg-black/10",
        )}
      />

      <div className="border-b border-zinc-200 pb-4 dark:border-zinc-700">
        <label className="flex items-center gap-1 text-xs font-medium text-zinc-700 dark:text-zinc-200">
          <Palette size={14} />
          <span>Color</span>
        </label>

        <div className="mt-2 grid grid-cols-5 gap-2">
          {COLORS.map((color) => (
            <button
              key={color}
              className={cn(
                "relative h-8 w-8 rounded-full border-2 border-zinc-200 transition-all hover:scale-110 dark:border-zinc-600",
                activeBackgroundId && "border-black/20 dark:border-white/20",
              )}
              style={{ backgroundColor: color }}
              onClick={() =>
                updateSelectOption(option.columnId, option.id, { color })
              }
            >
              {option.color === color && (
                <Check className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow" />
              )}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => deleteSelectOption(option.columnId, option.id)}
        className={cn(
          "flex items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-sm text-red-600 hover:bg-red-300/30 dark:text-red-400 dark:hover:bg-red-800/30",
        )}
      >
        <Trash2 className="size-4 shrink-0" />
        Delete option
      </button>
    </div>
  );
}
