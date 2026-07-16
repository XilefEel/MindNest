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
        "flex w-full items-center gap-2 rounded-md px-2 py-1 text-zinc-800 transition-[backround] dark:text-zinc-200",
        activeBackgroundId
          ? isActive
            ? "bg-teal-100/40 font-medium text-teal-600 dark:bg-teal-400/10 dark:text-teal-400"
            : "hover:bg-black/5 dark:hover:bg-white/5"
          : isActive
            ? "bg-teal-50 font-medium text-teal-600 dark:bg-teal-500/10 dark:text-teal-400"
            : "hover:bg-zinc-50 dark:hover:bg-zinc-700/50",
      )}
    >
      <Icon className="size-4 shrink-0" />
      <span className="text-sm leading-tight">{label}</span>
    </button>
  );
}
