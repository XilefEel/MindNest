import { Tag } from "@/lib/types/tag";
import { cn } from "@/lib/utils/general";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import { X } from "lucide-react";

export function NestlingTag({
  tag,
  onClick,
  onRemove,
  removeIcon = <X size={10} />,
}: {
  tag: Tag;
  onClick?: () => void;
  onRemove?: (tagId: number) => void;
  removeIcon?: React.ReactNode;
}) {
  const activeBackgroundId = useActiveBackgroundId();

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative flex items-center rounded-full px-1.5 py-[1px] shadow-xs transition-all select-none",
        (onClick || onRemove) && "hover:scale-105 hover:shadow-sm",
      )}
      style={{
        backgroundColor: activeBackgroundId ? `${tag.color}` : `${tag.color}30`,
        color: activeBackgroundId ? "#ffffff" : tag.color,
        border: `1px solid ${tag.color}`,
      }}
    >
      <span className="text-xs font-medium">{tag.name}</span>

      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(tag.id);
          }}
          className="absolute -top-2 -right-2 rounded-full bg-white p-0.5 opacity-0 shadow-sm transition-opacity group-hover:opacity-100 dark:bg-zinc-800"
          style={{
            color: tag.color,
            border: `1px solid ${tag.color}`,
          }}
        >
          {removeIcon}
        </button>
      )}
    </div>
  );
}
