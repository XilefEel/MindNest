import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { cn } from "@/lib/utils/general.ts";
import { getBlurClass } from "@/lib/utils/settings";
import { useActiveBackgroundId } from "@/stores/useNestStore.tsx";
import { useBlurStrength } from "@/stores/useSettingsStore";

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
  const blurStrength = useBlurStrength();

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        align={align}
        side={side}
        onDoubleClick={(e) => e.stopPropagation()}
        className={cn(
          "rounded-xl border-gray-200 bg-white select-none dark:border-zinc-700 dark:bg-zinc-800",
          width,
          activeBackgroundId &&
            cn(
              "border-transparent bg-white/30 dark:border-transparent dark:bg-black/30",
              getBlurClass(blurStrength),
            ),
        )}
      >
        {content}
      </PopoverContent>
    </Popover>
  );
}
