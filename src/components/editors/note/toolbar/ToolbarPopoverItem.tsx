import { cn } from "@/lib/utils/general";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import { LucideIcon } from "lucide-react";

export default function ToolBarPopoverItem({
  Icon,
  label,
  onFormat,
  isActive,
}: {
  Icon: LucideIcon;
  label: string;
  onFormat?: () => void;
  isActive?: boolean;
}) {
  const activeBackgroundId = useActiveBackgroundId();

  return (
    <button
      onMouseDown={(e) => {
        e.preventDefault();
        onFormat?.();
      }}
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-2 py-1 text-sm transition-colors",
        activeBackgroundId
          ? isActive
            ? "bg-teal-100/40 font-medium text-teal-600 dark:bg-teal-400/10 dark:text-teal-400"
            : "text-zinc-600 hover:bg-black/5 hover:text-zinc-800 dark:text-zinc-300 dark:hover:bg-white/5 dark:hover:text-zinc-100"
          : isActive
            ? "bg-teal-50 font-medium text-teal-600 dark:bg-teal-500/10 dark:text-teal-400"
            : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700/50 dark:hover:text-zinc-100",
      )}
    >
      <Icon className="size-4 shrink-0" />
      {label}
    </button>
  );
}
