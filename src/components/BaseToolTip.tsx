import { cn } from "@/lib/utils/general";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import * as Tooltip from "@radix-ui/react-tooltip";

export default function BaseTooltip({
  children,
  label,
  side = "bottom",
  sideOffset = 8,
}: {
  children: React.ReactNode;
  label: string;
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
}) {
  const activeBackgroundId = useActiveBackgroundId();

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          side={side}
          sideOffset={sideOffset}
          className={cn(
            "z-100 rounded px-2 py-1 text-xs shadow-md select-none",
            "bg-zinc-900 text-white dark:bg-zinc-800 dark:text-zinc-100",
            "data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            activeBackgroundId &&
              "bg-zinc-900/80 backdrop-blur-md dark:bg-zinc-800/80",
          )}
        >
          <span>{label}</span>
          <Tooltip.Arrow
            className={cn(
              "fill-zinc-900 dark:fill-zinc-800",
              activeBackgroundId &&
                "fill-zinc-900/80 backdrop-blur-md dark:fill-zinc-800/80",
            )}
          />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}
