import { cn } from "@/lib/utils/general";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import * as Tooltip from "@radix-ui/react-tooltip";

export default function BaseToolTip({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const activeBackgroundId = useActiveBackgroundId();
  return (
    <Tooltip.Provider delayDuration={200}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
        <Tooltip.Content
          side="bottom"
          sideOffset={8}
          className={cn(
            "data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            "relative z-50 rounded-lg px-3 py-1 text-sm shadow-md",
            "bg-white dark:bg-gray-800",
            activeBackgroundId &&
              "bg-white/30 backdrop-blur-sm dark:bg-black/30",
          )}
        >
          {label}
        </Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
