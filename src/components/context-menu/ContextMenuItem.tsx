import { cn } from "@/lib/utils/general";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import * as ContextMenu from "@radix-ui/react-context-menu";
import { ElementType, ReactNode } from "react";

export default function ContextMenuItem({
  action,
  Icon,
  text,
  isDelete,
  children,
}: {
  action: () => void;
  Icon: ElementType;
  text?: string;
  isDelete?: boolean;
  children?: ReactNode;
}) {
  const activeBackgroundId = useActiveBackgroundId();
  return (
    <ContextMenu.Item
      className={cn(
        "flex items-center gap-3 rounded px-2 py-1.5 text-sm transition-colors outline-none",
        "hover:bg-gray-100 dark:hover:bg-zinc-700/50",
        activeBackgroundId && "hover:bg-black/5 dark:hover:bg-white/5",
        isDelete &&
          "text-red-600 hover:bg-red-300/30 dark:text-red-400 dark:hover:bg-red-800/30",
      )}
      onSelect={() => action()}
      onClick={(e) => e.stopPropagation()}
      onDoubleClick={(e) => e.stopPropagation()}
    >
      <Icon className="size-4 flex-shrink-0" />
      {text ? <span>{text}</span> : children}
    </ContextMenu.Item>
  );
}
