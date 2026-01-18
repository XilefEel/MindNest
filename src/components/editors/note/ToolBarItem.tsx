import BaseToolTip from "@/components/BaseToolTip";
import { cn } from "@/lib/utils/general";

export default function ToolBarItem({
  Icon,
  label,
  onFormat,
  isActive,
}: {
  Icon: any;
  label: string;
  onFormat: () => void;
  isActive?: boolean;
}) {
  return (
    <BaseToolTip label={label}>
      <button
        onClick={onFormat}
        aria-label={label}
        className={cn(
          "cursor-pointer rounded p-1 transition-all duration-200 hover:text-teal-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-teal-300",
          isActive &&
            "bg-teal-100 text-teal-600 dark:bg-teal-900 dark:text-teal-300",
        )}
      >
        <Icon className="size-4" />
      </button>
    </BaseToolTip>
  );
}
