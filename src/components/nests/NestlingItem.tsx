import { Nestling } from "@/lib/types";
import { useDraggable } from "@dnd-kit/core";
import { FileText } from "lucide-react";

export default function NestlingItem({ nestling }: { nestling: Nestling }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `nestling-${nestling.id}`,
    });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className="text-muted-foreground flex cursor-pointer items-center gap-2 rounded px-2 py-1"
    >
      <FileText className="size-4" />
      <span>{nestling.title}</span>
    </div>
  );
}
