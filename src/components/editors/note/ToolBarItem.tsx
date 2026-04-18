import BaseToolTip from "@/components/BaseToolTip";
import { cn } from "@/lib/utils/general";
import { useActiveBackgroundId } from "@/stores/useNestStore";

export default function ToolBarItem({
  Icon,
  label,
  onFormat,
  isActive,
}: {
  Icon: any;
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
          "rounded p-1 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 dark:focus-visible:ring-teal-300",
          isActive
            ? "bg-teal-100 text-teal-600 dark:bg-teal-900 dark:text-teal-300"
            : "hover:text-teal-500 dark:hover:bg-gray-700 dark:hover:text-white",
          activeBackgroundId &&
            !isActive &&
            "hover:bg-white/30 hover:text-black dark:hover:bg-black/30",
        )}
      >
        <Icon className="size-4" />
      </button>
    </BaseToolTip>
  );
}
