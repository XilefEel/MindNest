import { cn } from "@/lib/utils/general";
import * as ContextMenu from "@radix-ui/react-context-menu";
import { ElementType, ReactNode } from "react";

export default function ContextMenuItem({
  action,
  Icon,
  text,
  isDelete,
  children,
}: {
  action?: () => void;
  Icon: ElementType;
  text?: string;
  isDelete?: boolean;
  children?: ReactNode;
}) {
  return (
    <ContextMenu.Item
      className={cn(
        "mx-1 flex cursor-pointer items-center gap-3 rounded px-3 py-2 text-sm transition-colors outline-none hover:bg-gray-100 dark:hover:bg-gray-700",
        isDelete &&
          "text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/40",
      )}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        action?.();
      }}
    >
      <Icon className="h-4 w-4" />
      {text ? <span>{text}</span> : children}
    </ContextMenu.Item>
  );
}
