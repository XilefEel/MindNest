import { cn } from "@/lib/utils"; // optional

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
        "flex items-center gap-3 w-full px-4 py-2 rounded-lg text-sm font-medium text-black dark:text-white transition-all duration-200",
        "hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-700 dark:hover:text-white",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:focus-visible:ring-blue-300",
        active &&
          "bg-blue-100 dark:bg-blue-200 text-blue-700 dark:text-blue-900 shadow-sm"
      )}
    >
      {icon} {label}
    </button>
  );
}
