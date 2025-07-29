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
        "flex w-full items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium text-black transition-all duration-200 dark:text-white",
        "hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-gray-700 dark:hover:text-white",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:focus-visible:ring-blue-300",
        active &&
          "bg-blue-100 text-blue-700 shadow-sm dark:bg-blue-200 dark:text-blue-900",
      )}
    >
      {icon} {label}
    </button>
  );
}
