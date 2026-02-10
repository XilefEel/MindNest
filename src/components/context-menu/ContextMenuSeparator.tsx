import { cn } from "@/lib/utils/general";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import * as ContextMenu from "@radix-ui/react-context-menu";

export default function ContextMenuSeparator() {
  const activeBackgroundId = useActiveBackgroundId();
  return (
    <ContextMenu.Separator
      className={cn(
        "mx-2 my-1 h-px bg-gray-200 dark:bg-gray-700",
        activeBackgroundId && "bg-black/30 dark:bg-white/30",
      )}
    />
  );
}
