import { Trash } from "lucide-react";
import { BoardCard } from "@/lib/types/board";
import { setActiveDraggingId, useBoardActions } from "@/stores/useBoardStore";
import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import CardContextMenu from "@/components/context-menu/CardContextMenu";
import CardPopover from "../../popovers/CardPopover";
import BasePopover from "@/components/popovers/BasePopover.tsx";
import { toast } from "@/lib/utils/toast";

export default function ColumnCard({ card }: { card: BoardCard }) {
  const [isOpen, setIsOpen] = useState(false);
  const { deleteCard } = useBoardActions();

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

  console.log(transform);

  const style = {
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleDelete = async () => {
    setActiveDraggingId("deleting");
    try {
      await deleteCard(card.id);
    } catch (err) {
      toast.error("Failed to delete card.");
    } finally {
      setActiveDraggingId(null);
    }
  };

  return (
    <CardContextMenu card={card}>
      <BasePopover
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        align="start"
        side="right"
        width="w-96"
        trigger={
          <div
            ref={setNodeRef}
            style={style}
            className="group relative rounded-lg bg-white p-3 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-700"
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
              className="absolute top-1/2 right-2 flex size-7 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/30"
            >
              <Trash className="size-3.5" />
            </button>
          </div>
        }
        content={<CardPopover card={card} onClose={() => setIsOpen(false)} />}
      />
    </CardContextMenu>
  );
}
