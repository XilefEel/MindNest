import { Trash, Plus } from "lucide-react";
import {
  setActiveDraggingId,
  useBoardActions,
  useBoardCards,
} from "@/stores/useBoardStore";
import ColumnCard from "./ColumnCard";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { toast } from "@/lib/utils/toast";
import { BoardColumn } from "@/lib/types/board";
import ColumnContextMenu from "@/components/context-menu/ColumnContextMenu";

export default function Column({ column }: { column: BoardColumn }) {
  const [title, setTitle] = useState(column.title);
  const [isEditing, setIsEditing] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const { createCard, updateColumn, removeColumn } = useBoardActions();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "column",
      column: column,
    },
  });

  const style = {
    backgroundColor: column.color,
    transform: transform ? `translateX(${transform.x}px)` : undefined,
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const cards = useBoardCards();
  const filteredCards = useMemo(
    () => cards.filter((card) => card.columnId === column.id),
    [cards, column.id],
  );

  const cardIds = filteredCards.map((card) => card.id);

  const handleAddCard = async () => {
    setActiveDraggingId("adding");
    try {
      await createCard({
        columnId: column.id,
        title: "New Card",
        description: "",
        orderIndex: cards.length + 1,
      });
    } catch (error) {
      toast.error("Error adding card to column.");
    } finally {
      setActiveDraggingId(null);
    }
  };

  const handleSubmit = async () => {
    try {
      const newTitle = title.trim();
      if (newTitle && newTitle !== column.title) {
        await updateColumn(column.id, { title: newTitle });
      }
    } catch (error) {
      toast.error("Failed to update column title.");
    } finally {
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
    if (e.key === "Escape") {
      setTitle(column.title);
      setIsEditing(false);
    }
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    setTitle(column.title);
  }, [column.title]);

  return (
    <ColumnContextMenu column={column}>
      <div
        ref={setNodeRef}
        key={column.id}
        style={style}
        className="flex w-72 flex-shrink-0 flex-col overflow-hidden rounded-2xl border border-black/5 shadow-lg"
      >
        <div
          className="flex cursor-grab items-center gap-1 bg-black/5 px-4 py-2.5 active:cursor-grabbing"
          {...listeners}
          {...attributes}
        >
          {isEditing ? (
            <input
              ref={inputRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleSubmit}
              onKeyDown={handleKeyDown}
              className="flex-1 rounded-lg border-0 bg-white px-3 py-1.5 text-sm font-semibold shadow-sm outline-none dark:bg-gray-700"
            />
          ) : (
            <h3
              className="flex-1 text-sm font-bold text-white drop-shadow-md"
              onDoubleClick={() => setIsEditing(true)}
            >
              {column.title}
            </h3>
          )}

          <span className="flex size-6 items-center justify-center rounded-full bg-black/20 text-xs font-bold text-white shadow-sm">
            {filteredCards.length}
          </span>

          <button
            onClick={() => removeColumn(column.id)}
            className="flex size-8 items-center justify-center rounded-lg text-white/80 transition hover:bg-black/10 hover:text-white"
          >
            <Trash className="size-4" />
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-2 px-2 py-3">
          {filteredCards.length > 0 ? (
            <SortableContext
              items={cardIds}
              strategy={verticalListSortingStrategy}
            >
              {filteredCards.map((card) => (
                <ColumnCard key={card.id} card={card} />
              ))}
            </SortableContext>
          ) : (
            <div className="flex min-h-[120px] items-center justify-center rounded-xl border-2 border-dashed border-white/30 text-sm font-medium text-white/70">
              Drop cards here
            </div>
          )}
        </div>

        <button
          onClick={handleAddCard}
          className="flex items-center gap-2 bg-black/10 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-black/15"
        >
          <Plus className="size-4" />
          New
        </button>
      </div>
    </ColumnContextMenu>
  );
}
