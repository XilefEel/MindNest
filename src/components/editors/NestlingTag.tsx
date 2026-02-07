import { Tag } from "@/lib/types/tag";
import { X } from "lucide-react";

export function NestlingTag({
  tag,
  onClick,
  onRemove,
}: {
  tag: Tag;
  onClick?: () => void;
  onRemove?: (tagId: number) => void;
}) {
  return (
    <div
      className="group relative flex cursor-pointer items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium shadow-xs select-none"
      style={{
        backgroundColor: `${tag.color}20`,
        color: tag.color,
        border: `1px solid ${tag.color}40`,
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
          className="absolute -top-1.5 -right-1.5 cursor-pointer rounded-full bg-white p-0.5 opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
          style={{
            color: tag.color,
            border: `1px solid ${tag.color}`,
          }}
        >
          <X size={12} />
        </button>
      )}
    </div>
  );
}
