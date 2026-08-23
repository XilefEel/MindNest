import { cn } from "@/lib/utils/general";
import { LucideIcon } from "lucide-react";
import BaseTooltip from "@/components/BaseTooltip";

export default function TopbarButton({
  label,
  action,
  Icon,
  isHidden = false,
}: {
  label: string;
  action: () => void;
  Icon: LucideIcon;
  isHidden?: boolean;
}) {
  return (
    <BaseTooltip label={label}>
      <button
        className={cn(
          "rounded-lg text-zinc-800 transition-colors dark:text-zinc-200",
          "hover:text-teal-500 dark:hover:text-teal-300",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 dark:focus-visible:ring-teal-300",
          isHidden && "block md:hidden",
        )}
        onClick={action}
        onDoubleClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Icon className="size-4 sm:size-5" />
      </button>
    </BaseTooltip>
  );
}
