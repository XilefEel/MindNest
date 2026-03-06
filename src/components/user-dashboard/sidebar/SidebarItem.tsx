import { cn } from "@/lib/utils/general";
import { LucideIcon } from "lucide-react";

export default function SidebarItem({
  Icon,
  label,
  active = false,
  handleClick,
  isCollapsed = false,
}: {
  Icon: LucideIcon;
  label: string;
  active?: boolean;
  handleClick?: () => void;
  isCollapsed?: boolean;
}) {
  return (
    <div
      onClick={handleClick}
      onDoubleClick={(e) => {
        e.stopPropagation();
      }}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg p-2 text-sm font-medium transition-colors",
        "text-gray-800 dark:text-gray-200",
        "hover:bg-gray-50 dark:hover:bg-gray-700",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 dark:focus-visible:ring-teal-300",
        active &&
          "bg-teal-100 font-bold text-teal-800 hover:bg-teal-100 hover:text-teal-800 dark:bg-teal-500 hover:dark:bg-teal-500",
      )}
    >
      <Icon className="size-5 shrink-0" />

      <span
        className={cn(
          "overflow-hidden whitespace-nowrap transition-colors",
          isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100",
        )}
      >
        {label}
      </span>
    </div>
  );
}
