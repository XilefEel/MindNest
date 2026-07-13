import { cn } from "@/lib/utils/general";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import * as Select from "@radix-ui/react-select";
import { ChevronDown, Check } from "lucide-react";

export default function BaseSelectMenu({
  value,
  onChange,
  options,
  size = "text-sm",
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  size?: "text-xs" | "text-sm";
}) {
  const activeBackgroundId = useActiveBackgroundId();

  return (
    <Select.Root
      value={value}
      onValueChange={(value) => onChange(value == "__any__" ? "" : value)}
    >
      <Select.Trigger
        className={cn(
          "flex items-center gap-3 rounded-lg border px-3 py-1 transition-colors focus:outline-none",
          activeBackgroundId
            ? "border-white/20 bg-white/10 backdrop-blur-sm hover:bg-black/5 dark:bg-white/5 dark:hover:bg-white/10"
            : "border-zinc-200 text-zinc-700 focus:ring-2 focus:ring-teal-500 dark:border-zinc-700 dark:text-zinc-200 dark:focus:ring-teal-400",
          size,
        )}
      >
        <Select.Value />
        <Select.Icon>
          <ChevronDown className="size-3 shrink-0" />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          position="popper"
          align="end"
          side="bottom"
          sideOffset={4}
          className={cn(
            "z-100 w-28 overflow-hidden rounded-lg border shadow-sm",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
            activeBackgroundId
              ? "border-white/20 bg-white/30 backdrop-blur-sm dark:bg-white/0"
              : "border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800",
            size,
          )}
        >
          <Select.Viewport>
            {options.map((opt) => (
              <Select.Item
                key={opt.value}
                value={opt.value}
                className={cn(
                  "flex cursor-default items-center justify-between px-3 py-1.5 transition-colors outline-none select-none",
                  "text-zinc-800 dark:text-zinc-200",
                  activeBackgroundId
                    ? "data-highlighted:bg-white/20 dark:data-highlighted:bg-white/10"
                    : "data-highlighted:bg-zinc-50 dark:data-highlighted:bg-zinc-700/50",
                )}
              >
                <Select.ItemText>{opt.label}</Select.ItemText>
                <Select.ItemIndicator>
                  <Check
                    className={cn(
                      "size-3",
                      !activeBackgroundId && "text-teal-500 dark:text-teal-400",
                    )}
                  />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
