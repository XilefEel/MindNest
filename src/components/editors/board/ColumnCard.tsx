import { BoardCard } from "@/lib/types/board";
import { useSortable } from "@dnd-kit/react/sortable";
import { useState } from "react";
import BasePopover from "@/components/popovers/BasePopover.tsx";
import CardPopover from "../../popovers/CardPopover";
import { useBoardActions } from "@/stores/useBoardStore";
import { Trash } from "lucide-react";
import { toast } from "sonner";

export default function ColumnCard({
  card,
  columnId,
  index,
}: {
  card: BoardCard;
  columnId: number;
  index: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { deleteCard } = useBoardActions();

  const { ref, isDragging } = useSortable({
    id: card.id,
    group: columnId,
    accept: "card",
    type: "card",
    index,
    data: { group: columnId },
  });

  const handleDelete = async () => {
    try {
      await deleteCard(card.id, columnId);
    } catch (err) {
      toast.error("Failed to delete card.");
    }
  };

  return (
    <BasePopover
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      align="start"
      side="right"
      width="w-96"
      trigger={
        <div
          ref={ref as any}
          data-shadow={isDragging || undefined}
          className="group relative rounded-md bg-white p-2 shadow-md"
        >
          <h3 className="text-sm font-semibold text-zinc-800">{card.title}</h3>

          {card.description && (
            <p className="text-xs text-zinc-500">{card.description}</p>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            className="absolute top-1/2 right-2 flex size-7 -translate-y-1/2 items-center justify-center rounded-lg text-zinc-400 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-50 hover:text-red-500"
          >
            <Trash className="size-3.5" />
          </button>
        </div>
      }
      content={<CardPopover card={card} onClose={() => setIsOpen(false)} />}
    />
  );
}
