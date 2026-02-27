import { cn } from "@/lib/utils/general";
import { LucideIcon } from "lucide-react";
import BaseToolTip from "@/components/BaseToolTip.tsx";
import { useActiveBackgroundId } from "@/stores/useNestStore.tsx";

export default function ({
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
  const activeBackgroundId = useActiveBackgroundId();

  return (
    <BaseToolTip label={label}>
      <button
        className={cn(
          "rounded-lg p-2 text-gray-800 transition-colors dark:text-gray-200",
          "hover:text-teal-500 dark:hover:text-teal-300",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 dark:focus-visible:ring-teal-300",
          activeBackgroundId && "hover:bg-white/20 dark:hover:bg-black/20",
          isHidden && "block md:hidden",
        )}
        onClick={action}
        onDoubleClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Icon className="size-4 sm:size-5" />
      </button>
    </BaseToolTip>
  );
}
