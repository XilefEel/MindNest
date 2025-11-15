import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/general";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import { LucideIcon } from "lucide-react";

export default function ({
  action,
  Icon,
  isHidden,
}: {
  action: () => void;
  Icon: LucideIcon;
  isHidden?: boolean;
}) {
  const activeBackgroundId = useActiveBackgroundId();

  return (
    <Button
      variant="ghost"
      className={cn(
        "cursor-pointer rounded-lg hover:bg-teal-100 hover:text-teal-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-teal-300",
        activeBackgroundId && "hover:bg-white/20 dark:hover:bg-black/20",
        isHidden && "block md:hidden",
      )}
      onClick={action}
      onDoubleClick={(e) => {
        e.stopPropagation();
      }}
    >
      <Icon className="size-4 sm:size-5" />
    </Button>
  );
}
