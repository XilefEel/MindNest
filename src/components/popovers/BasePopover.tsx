import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { cn } from "@/lib/utils/general.ts";
import { useActiveBackgroundId } from "@/stores/useNestStore.tsx";

export default function BasePopover({
  trigger,
  content,
  isOpen,
  setIsOpen,
  align = "start",
  side = "bottom",
  width = "w-80",
}: {
  trigger: React.ReactNode;
  content: React.ReactNode;
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
  align?: "start" | "center" | "end";
  side?: "top" | "right" | "bottom" | "left";
  width?: string;
}) {
  const activeBackgroundId = useActiveBackgroundId();

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        align={align}
        side={side}
        className={cn(
          "rounded-xl border-gray-200 bg-white select-none dark:border-gray-700 dark:bg-gray-800",
          width,
          activeBackgroundId &&
            "border-0 bg-white/30 backdrop-blur-sm dark:bg-black/30",
        )}
      >
        {content}
      </PopoverContent>
    </Popover>
  );
}
