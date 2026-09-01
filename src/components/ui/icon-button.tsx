import { cn } from "@/lib/utils/general";
import { LucideIcon } from "lucide-react";
import BaseTooltip from "../BaseTooltip";
import { useActiveBackgroundId } from "@/stores/useNestStore";

export default function IconButton({
  label,
  onClick,
  Icon,
  disabled,
  className,
  iconSize = "size-4",
}: {
  label: string;
  onClick: () => void;
  Icon: LucideIcon;
  disabled?: boolean;
  className?: string;
  iconSize?: string;
}) {
  const activeBackgroundId = useActiveBackgroundId();

  return (
    <BaseTooltip label={label}>
      <button
        onClick={onClick}
        disabled={disabled ?? false}
        className={cn(
          "rounded p-2 transition-colors",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 dark:focus-visible:ring-teal-300",
          "hover:text-teal-500 dark:hover:text-teal-400",
          "disabled:cursor-default disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-current dark:disabled:cursor-default dark:disabled:opacity-50 dark:disabled:hover:bg-transparent dark:disabled:hover:text-current",
          activeBackgroundId &&
            "hover:bg-black/5 hover:text-black dark:hover:bg-white/5",
          className,
        )}
      >
        <Icon className={cn("shrink-0", iconSize)} />
      </button>
    </BaseTooltip>
  );
}
