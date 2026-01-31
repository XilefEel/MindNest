import { Trash } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { BoardCard } from "@/lib/types/board";
import { setActiveDraggingId, useBoardActions } from "@/stores/useBoardStore";
import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import CardContextMenu from "@/components/context-menu/CardContextMenu";
import CardPopover from "./CardPopover";
import { cn } from "@/lib/utils/general";
import { useActiveBackgroundId } from "@/stores/useNestStore";

export default function ColumnCard({ card }: { card: BoardCard }) {
  const [isOpen, setIsOpen] = useState(false);
  const { deleteCard } = useBoardActions();
  const activeBackgroundId = useActiveBackgroundId();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: {
      type: "card",
      card: card,
    },
  });

  const style = {
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleDelete = async () => {
    setActiveDraggingId("deleting");
    try {
      await deleteCard(card.id);
    } catch (err) {
      console.error("Failed to delete card:", err);
    } finally {
      setActiveDraggingId(null);
    }
  };

  return (
    <CardContextMenu card={card}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div
            ref={setNodeRef}
            style={style}
            className="group relative cursor-pointer rounded-lg bg-white p-3 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-700"
          >
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing"
              onClick={(e) => {
                if (isDragging) {
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
            >
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                {card.title}
              </h3>
              {card.description && (
                <p className="mt-1 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
                  {card.description}
                </p>
              )}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              className="absolute top-1/2 right-2 flex size-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-gray-400 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30"
            >
              <Trash className="size-3.5" />
            </button>
          </div>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          side="right"
          className={cn(
            "w-96 border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800",
            activeBackgroundId &&
              "border-0 bg-white/30 backdrop-blur-sm dark:bg-black/30",
          )}
        >
          <CardPopover card={card} onClose={() => setIsOpen(false)} />
        </PopoverContent>
      </Popover>
    </CardContextMenu>
  );
}
