import { cn } from "@/lib/utils/general";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import * as ContextMenu from "@radix-ui/react-context-menu";

export default function ContextSubMenu({
  trigger,
  content,
  width = "min-w-[220px]",
}: {
  trigger: React.ReactNode;
  content: React.ReactNode;
  width?: string;
}) {
  const activeBackgroundId = useActiveBackgroundId();
  return (
    <ContextMenu.Sub>
      <ContextMenu.SubTrigger
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        className={cn(
          "mx-1 flex items-center gap-3 rounded px-3 py-2 text-sm transition-colors outline-none hover:bg-gray-100 dark:hover:bg-gray-700",
          activeBackgroundId && "hover:bg-white/30 dark:hover:bg-black/30",
        )}
      >
        {trigger}
      </ContextMenu.SubTrigger>

      <ContextMenu.Portal>
        <ContextMenu.SubContent
          className={cn(
            "animate-in fade-in-0 zoom-in-95 z-50 rounded-lg border border-gray-200 bg-white py-2 shadow-lg select-none dark:border-gray-700 dark:bg-gray-800",
            width,
            activeBackgroundId &&
              "border-transparent bg-white/30 backdrop-blur-sm hover:bg-white/30 dark:border-transparent dark:bg-black/30 dark:hover:bg-black/30",
          )}
        >
          {content}
        </ContextMenu.SubContent>
      </ContextMenu.Portal>
    </ContextMenu.Sub>
  );
}
