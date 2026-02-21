import { cn } from "@/lib/utils/general";
import { motion } from "framer-motion";

export default function SidebarItem({
  icon,
  label,
  active = false,
  onClick,
  isCollapsed = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  isCollapsed?: boolean;
}) {
  return (
    <motion.div whileTap={{ scale: 0.95 }}>
      <div
        onClick={onClick}
        onDoubleClick={(e) => {
          e.stopPropagation();
        }}
        className={cn(
          "flex w-full items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium text-black transition-all duration-200 dark:text-white",
          "hover:bg-teal-50 dark:hover:bg-gray-700 dark:hover:text-white",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 dark:focus-visible:ring-teal-300",
          "hover:scale-105",
          active && "bg-teal-100 font-bold text-teal-700 dark:bg-teal-500",
          isCollapsed && "px-2",
        )}
        title={isCollapsed ? label : undefined}
      >
        <span className="shrink-0">{icon}</span>
        <span
          className={cn(
            "overflow-hidden whitespace-nowrap transition-all duration-300",
            isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100",
          )}
        >
          {label}
        </span>
      </div>
    </motion.div>
  );
}
