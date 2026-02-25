import { cn } from "@/lib/utils/general";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import { useState, ReactNode } from "react";
import BasePopover from "@/components/popovers/BasePopover";

export default function StatCard({
  label,
  value,
  icon,
  type,
  onClick,
  popoverContent,
}: {
  label: string;
  value: number;
  icon: string;
  type?: "popover" | "clickable";
  onClick?: () => void;
  popoverContent?: ReactNode;
}) {
  const activeBackgroundId = useActiveBackgroundId();
  const [popoverOpen, setPopoverOpen] = useState(false);

  const cardContent = (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl shadow-sm",
        "group rounded-xl border border-b-4 p-4 hover:shadow-md",
        "bg-white dark:bg-gray-800",
        "border-gray-200 border-b-orange-500 hover:border-orange-500 dark:border-gray-800 dark:border-b-orange-500 dark:hover:border-orange-500",
        activeBackgroundId &&
          "border-t-0 border-r-0 border-l-0 bg-white/10 backdrop-blur-sm dark:bg-black/10",
      )}
    >
      <div className="mb-3 text-4xl">{icon}</div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white">
        {value}
      </div>
      <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
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
