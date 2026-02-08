import { Tag } from "@/lib/types/tag";
import { X } from "lucide-react";
import TagContextMenu from "../context-menu/TagContextMenu";

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
  return (
    <TagContextMenu tag={tag}>
      <div
        className="group relative flex cursor-pointer items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium shadow-xs transition-all select-none hover:shadow-sm"
        style={{
          backgroundColor: `${tag.color}30`,
          color: tag.color,
          border: `1px solid ${tag.color}`,
        }}
        onClick={onClick}
      >
        {tag.name}

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
    </TagContextMenu>
  );
}
