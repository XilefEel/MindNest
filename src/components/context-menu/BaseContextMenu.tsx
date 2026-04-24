import { cn } from "@/lib/utils/general";
import { getBlurClass } from "@/lib/utils/settings";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import { useBlurStrength } from "@/stores/useSettingsStore";
import * as ContextMenu from "@radix-ui/react-context-menu";

export default function BaseContextMenu({
  children,
  content,
}: {
  children: React.ReactNode;
  content: React.ReactNode;
}) {
  const activeBackgroundId = useActiveBackgroundId();
  const blurStrength = useBlurStrength();

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>{children}</ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content
          onClick={(e) => e.stopPropagation()}
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className={cn(
            "animate-in fade-in-0 zoom-in-95",
            "z-50 min-w-[220px] rounded-lg p-2 shadow-lg select-none",
            "bg-white dark:bg-gray-800",
            "border border-gray-200 dark:border-gray-700",
            activeBackgroundId &&
              cn(
                "border-transparent bg-white/30 dark:border-transparent dark:bg-black/30",
                getBlurClass(blurStrength),
              ),
          )}
        >
          {content}
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
}
