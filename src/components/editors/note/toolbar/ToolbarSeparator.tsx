import { cn } from "@/lib/utils/general";
import { useActiveBackgroundId } from "@/stores/useNestStore";

export default function ToolbarSeparator() {
  const activeBackgroundId = useActiveBackgroundId();

  return (
    <div
      className={cn(
        "border-r border-zinc-200 dark:border-zinc-700",
        activeBackgroundId && "border-black/30 dark:border-white/30",
      )}
    />
  );
}
