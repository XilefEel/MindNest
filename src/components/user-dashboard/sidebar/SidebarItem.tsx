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
      onDoubleClick={(e) => e.stopPropagation()}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400"
          : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/50",
      )}
    >
      <Icon size={16} className="shrink-0" />
      <span
        className={cn(
          "overflow-hidden whitespace-nowrap transition-all duration-300",
          isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100",
        )}
      >
        {label}
      </span>
    </div>
  );
}
