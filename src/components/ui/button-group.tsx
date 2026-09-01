import { cn } from "@/lib/utils/general";
import { useActiveBackgroundId } from "@/stores/useNestStore";

export default function ButtonGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  const activeBackgroundId = useActiveBackgroundId();

  return (
    <div className="flex items-center justify-between px-2 py-1">
      <span className="text-sm leading-tight">{label}</span>

      <div
        className={cn(
          "flex overflow-hidden rounded-md border",
          activeBackgroundId
            ? "border-white/20 bg-white/10 backdrop-blur-sm dark:bg-white/5"
            : "border-zinc-200 dark:border-zinc-700",
        )}
      >
        {options.map(({ label, value: optionValue }) => (
          <button
            key={optionValue}
            onClick={() => onChange(optionValue)}
            className={cn(
              "px-2 py-1 text-xs transition-colors",
              activeBackgroundId
                ? value === optionValue
                  ? "bg-white/20 text-teal-600 dark:bg-white/10 dark:text-teal-400"
                  : "hover:bg-black/5 dark:hover:bg-white/5"
                : value === optionValue
                  ? "bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400"
                  : "hover:bg-zinc-50 dark:hover:bg-zinc-700/50",
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
