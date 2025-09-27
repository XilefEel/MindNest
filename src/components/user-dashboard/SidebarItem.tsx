import { cn } from "@/lib/utils/general";

export default function SidebarItem({
  icon,
  label,
  active = false,
  onClick,
}: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium text-black transition-all duration-200 dark:text-white",
        "hover:bg-teal-50 hover:text-teal-700 dark:hover:bg-gray-700 dark:hover:text-white",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 dark:focus-visible:ring-teal-300",
        active && "bg-teal-300 shadow-sm dark:bg-teal-500",
      )}
    >
      {icon} {label}
    </button>
  );
}
