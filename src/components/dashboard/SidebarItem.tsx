import { cn } from "@/lib/utils"; // optional

export default function SidebarItem({
  icon,
  label,
  active = false,
  onClick,
}: any) {
  return (
    <button
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-50 w-full text-left",
        active && "bg-blue-100 text-blue-800 font-medium"
      )}
      onClick={onClick}
    >
      {icon} {label}
    </button>
  );
}
