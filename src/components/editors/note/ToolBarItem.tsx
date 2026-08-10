import BaseToolTip from "@/components/BaseToolTip";
import { cn } from "@/lib/utils/general";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import { LucideIcon } from "lucide-react";

export default function ToolBarItem({
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
    <BaseToolTip label={label}>
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          onFormat?.();
        }}
        className={cn(
          "rounded p-1 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 dark:focus-visible:ring-teal-300",
          isActive
            ? "bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400"
            : "hover:text-teal-500 dark:hover:bg-zinc-700/50 dark:hover:text-white",
          activeBackgroundId &&
            !isActive &&
            "hover:bg-black/5 hover:text-black dark:hover:bg-white/5",
        )}
      >
        <Icon className="size-4 shrink-0" />
      </button>
    </BaseToolTip>
  );
}
