import { Tag } from "@/lib/types/tag";
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
      className="group relative flex cursor-pointer items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium shadow-xs transition-all select-none hover:scale-105 hover:shadow-sm"
      style={{
        backgroundColor: activeBackgroundId ? `${tag.color}` : `${tag.color}30`,
        color: activeBackgroundId ? "#ffffff" : tag.color,
        border: `1px solid ${tag.color}`,
      }}
      onClick={onClick}
    >
      <span>{tag.name}</span>

      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(tag.id);
          }}
          className="absolute -top-2 -right-2 cursor-pointer rounded-full bg-white p-1 opacity-0 shadow-sm transition-opacity group-hover:opacity-100 dark:bg-gray-800"
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
