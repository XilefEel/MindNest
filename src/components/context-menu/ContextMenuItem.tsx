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
        "mx-1 flex items-center gap-3 rounded px-3 py-2 text-sm transition-colors outline-none hover:bg-gray-100 dark:hover:bg-gray-700",
        activeBackgroundId && "hover:bg-white/30 dark:hover:bg-black/30",
        isDelete &&
          "text-red-600 hover:bg-red-300/30 dark:text-red-400 dark:hover:bg-red-800/30",
      )}
      onSelect={() => action()}
      onClick={(e) => e.stopPropagation()}
      onDoubleClick={(e) => e.stopPropagation()}
    >
      <Icon className="h-4 w-4" />
      {text ? <span>{text}</span> : children}
    </ContextMenu.Item>
  );
}
