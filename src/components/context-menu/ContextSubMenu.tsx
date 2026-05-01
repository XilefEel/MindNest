import { cn } from "@/lib/utils/general";
import { getBlurClass } from "@/lib/utils/settings";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import { useBlurStrength } from "@/stores/useSettingsStore";
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
  const blurStrength = useBlurStrength();

  return (
    <ContextMenu.Sub>
      <ContextMenu.SubTrigger
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        className={cn(
          "flex items-center gap-3 rounded px-2 py-1.5 text-sm transition-colors outline-none",
          "hover:bg-gray-100 dark:hover:bg-zinc-700/50",
          activeBackgroundId && "hover:bg-black/5 dark:hover:bg-white/5",
        )}
      >
        {trigger}
      </ContextMenu.SubTrigger>

      <ContextMenu.Portal>
        <ContextMenu.SubContent
          className={cn(
            "animate-in fade-in-0 zoom-in-95",
            "z-50 rounded-lg p-2 shadow-lg select-none",
            "bg-white dark:bg-zinc-800",
            "border border-gray-200 dark:border-zinc-700",
            width,
            activeBackgroundId &&
              cn(
                "border-transparent bg-white/30 dark:border-transparent dark:bg-black/30",
                getBlurClass(blurStrength),
              ),
          )}
        >
          {content}
        </ContextMenu.SubContent>
      </ContextMenu.Portal>
    </ContextMenu.Sub>
  );
}
