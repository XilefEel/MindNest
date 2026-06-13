import { cn } from "@/lib/utils/general";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import * as ContextMenu from "@radix-ui/react-context-menu";

export default function ContextMenuSeparator() {
  const activeBackgroundId = useActiveBackgroundId();
  return (
    <ContextMenu.Separator
      className={cn(
        "mx-2 my-1 shrink-0 border-t border-zinc-200 dark:border-zinc-700",
        activeBackgroundId && "border-black/30 dark:border-white/30",
      )}
    />
  );
}
