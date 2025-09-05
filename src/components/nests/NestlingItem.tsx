import { saveLastNestling } from "@/lib/session";
import { Nestling } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useNestlingTreeStore } from "@/stores/useNestlingStore";
import { useDraggable } from "@dnd-kit/core";
import {
  FileText,
  Calendar,
  Images,
  GripVertical,
  LucideIcon,
  KanbanSquare,
  Notebook,
  Table2,
  Network,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  note: FileText,
  board: KanbanSquare,
  calendar: Calendar,
  journal: Notebook,
  gallery: Images,
  mindmap: Table2,
  database: Network,
};

export default function NestlingItem({
  nestling,
  setIsSidebarOpen,
}: {
  nestling: Nestling;
  setIsSidebarOpen: (isOpen: boolean) => void;
}) {
  const { activeNestling, setActiveFolderId, setActiveNestling } =
    useNestlingTreeStore();

  const handleSelect = () => {
    setActiveNestling(nestling);
    saveLastNestling(nestling);
  };

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

  const Icon = iconMap[nestling.nestling_type] || FileText;

  return (
    <div
      className={cn(
        "flex w-full max-w-full cursor-pointer items-center justify-between gap-1 truncate rounded px-2 py-1 font-medium transition-colors duration-200 hover:bg-teal-50 dark:hover:bg-gray-700",
        nestling.id === activeNestling?.id &&
          "bg-teal-100 font-bold text-teal-900 dark:bg-teal-400 dark:text-white",
      )}
      onClick={() => {
        handleSelect();
        setActiveFolderId(nestling.folder_id || null);
        setIsSidebarOpen(false);
      }}
      style={style}
    >
      <div className="flex items-center gap-1">
        <Icon className="size-4" />
        <span className="max-w-[140px] truncate">{nestling.title}</span>
      </div>

      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        onClick={(e) => e.stopPropagation()}
        className="cursor-grab p-1"
      >
        <GripVertical className="h-4 w-4 text-gray-500 dark:text-gray-200" />
      </div>
    </div>
  );
}
