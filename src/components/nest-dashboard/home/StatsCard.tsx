import { cn } from "@/lib/utils/general";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState, ReactNode } from "react";

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
        "group cursor-pointer rounded-xl border border-b-4 p-4 hover:shadow-md",
        "bg-white dark:bg-gray-800",
        "border-gray-200 border-b-orange-500 hover:border-orange-500 dark:border-gray-800 dark:border-b-orange-500 dark:hover:border-orange-500",
        "transition",
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
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>{cardContent}</PopoverTrigger>
        <PopoverContent
          side="right"
          className={cn(
            "w-80 border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800",
            activeBackgroundId &&
              "border-0 bg-white/30 backdrop-blur-sm dark:bg-black/30",
          )}
        >
          {popoverContent}
        </PopoverContent>
      </Popover>
    );
  }

  return <div onClick={onClick}>{cardContent}</div>;
}
