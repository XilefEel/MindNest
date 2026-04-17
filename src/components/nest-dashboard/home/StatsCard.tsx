import { cn } from "@/lib/utils/general";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import { useState, ReactNode } from "react";
import BasePopover from "@/components/popovers/BasePopover";
import { LucideIcon } from "lucide-react";

const colorMap = {
  teal: {
    icon: "bg-teal-50 text-teal-500 dark:bg-teal-500/10 dark:text-teal-400",
    border: "hover:border-teal-500 dark:hover:border-teal-400",
    number: "group-hover:text-teal-500 dark:group-hover:text-teal-400",
  },
  purple: {
    icon: "bg-purple-50 text-purple-500 dark:bg-purple-500/10 dark:text-purple-400",
    border: "hover:border-purple-500 dark:hover:border-purple-400",
    number: "group-hover:text-purple-500 dark:group-hover:text-purple-400",
  },
  amber: {
    icon: "bg-amber-50 text-amber-500 dark:bg-amber-500/10 dark:text-amber-400",
    border: "hover:border-amber-500 dark:hover:border-amber-400",
    number: "group-hover:text-amber-500 dark:group-hover:text-amber-400",
  },
  rose: {
    icon: "bg-rose-50 text-rose-500 dark:bg-rose-500/10 dark:text-rose-400",
    border: "hover:border-rose-500 dark:hover:border-rose-400",
    number: "group-hover:text-rose-500 dark:group-hover:text-rose-400",
  },
};

export default function StatCard({
  label,
  value,
  Icon,
  color = "teal",
  type,
  onClick,
  popoverContent,
}: {
  label: string;
  value: number;
  Icon: LucideIcon;
  color?: keyof typeof colorMap;
  type?: "popover" | "clickable";
  onClick?: () => void;
  popoverContent?: ReactNode;
}) {
  const activeBackgroundId = useActiveBackgroundId();
  const [popoverOpen, setPopoverOpen] = useState(false);

  const { icon, border, number } = colorMap[color];

  const cardContent = (
    <div
      className={cn(
        "group flex flex-col items-center justify-center gap-1 rounded-2xl border p-4 shadow-sm hover:shadow-md",
        "bg-white dark:bg-gray-800",
        "border-gray-100 dark:border-gray-700",
        "transition-[scale,border] hover:scale-[1.02]",
        border,
        activeBackgroundId &&
          "border-transparent bg-white/10 backdrop-blur-sm dark:border-transparent dark:bg-black/10",
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center rounded-xl bg-teal-50 p-2.5",
          icon,
        )}
      >
        <Icon size={28} />
      </div>
      <div
        className={cn(
          "text-2xl font-bold text-gray-900 dark:text-white",
          number,
        )}
      >
        {value}
      </div>
      <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
    </div>
  );

  if (type === "popover" && popoverContent) {
    return (
      <BasePopover
        isOpen={popoverOpen}
        setIsOpen={setPopoverOpen}
        trigger={cardContent}
        content={popoverContent}
        side="right"
        align="center"
      />
    );
  }

  return <div onClick={onClick}>{cardContent}</div>;
}
