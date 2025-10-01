import { cn } from "@/lib/utils/general";
import { useNestStore } from "@/stores/useNestStore";
import * as ContextMenu from "@radix-ui/react-context-menu";

export default function BaseContextMenu({
  children,
  content,
}: {
  children: React.ReactNode;
  content: React.ReactNode;
}) {
  const { activeBackgroundId } = useNestStore();
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>{children}</ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content
          className={cn(
            "animate-in fade-in-0 zoom-in-95 z-50 min-w-[220px] rounded-lg border border-gray-200 bg-white py-2 shadow-lg dark:border-gray-700 dark:bg-gray-800",
            activeBackgroundId &&
              "border-0 bg-white/30 backdrop-blur-sm dark:bg-black/30",
          )}
        >
          {content}
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
}
