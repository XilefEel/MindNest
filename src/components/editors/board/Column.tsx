import { Button } from "@/components/ui/button";
import { Trash, Plus } from "lucide-react";
import {
  setActiveDraggingId,
  useActiveDraggingId,
  useBoardActions,
  useBoardCards,
} from "@/stores/useBoardStore";
import ColumnCard from "./ColumnCard";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSortable } from "@dnd-kit/sortable";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { toast } from "sonner";
import { BoardColumn } from "@/lib/types/board";
import ColumnContextMenu from "@/components/context-menu/ColumnContextMenu";

export default function Column({ column }: { column: BoardColumn }) {
  const [title, setTitle] = useState(column.title);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { createCard, updateColumn, removeColumn } = useBoardActions();
  const activeDraggingId = useActiveDraggingId();

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
    transform: transform ? `translateX(${transform.x}px)` : undefined,
    transition,
    opacity: isDragging ? 0.5 : 1,
    backgroundColor: column.color,
  };

  const cards = useBoardCards();
  const filteredCards = cards.filter((card) => card.columnId === column.id);

  const cardIds = filteredCards.map((card) => card.id);

  const handleAddCard = async () => {
    setActiveDraggingId("adding");
    try {
      await createCard({
        columnId: column.id,
        title: `New Card ${cards.length + 1}`,
        description: String(cards.length + 1),
        orderIndex: cards.length + 1,
      });
    } catch (error) {
      console.error("Error adding column:", error);
    } finally {
      setActiveDraggingId(null);
    }
  };

  const handleSubmit = async () => {
    try {
      const newTitle = title.trim();
      if (newTitle && newTitle !== column.title) {
        await updateColumn({
          id: column.id,
          title: newTitle,
          orderIndex: column.orderIndex,
          color: column.color,
        });
      }
    } catch (error) {
      toast.error("Failed to update column title.");
      console.error(error);
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
      <motion.div
        key={column.id}
        layout={!activeDraggingId}
        exit={{ opacity: 0 }}
        transition={{
          layout: { duration: 0.25, ease: "easeInOut" },
          duration: 0.15,
        }}
      >
        <div
          ref={setNodeRef}
          style={style}
          className="flex w-72 flex-shrink-0 flex-col rounded-xl shadow-sm dark:border-gray-700"
        >
          <div
            className="flex items-center gap-2 border-b border-gray-200 px-4 py-2.5 dark:border-gray-700"
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
                className="w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm font-medium outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-800"
              />
            ) : (
              <h3
                className="flex-1 cursor-pointer text-sm font-semibold"
                onClick={() => setIsEditing(true)}
              >
                {column.title}
              </h3>
            )}

            <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium dark:bg-gray-700">
              {filteredCards.length}
            </span>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeColumn(column.id)}
              className="size-8 text-red-400 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-950 dark:hover:text-red-400"
            >
              <Trash className="size-4" />
            </Button>
          </div>

          <div className="py-2 transition-all duration-200">
            {filteredCards.length > 0 ? (
              <SortableContext
                items={cardIds}
                strategy={verticalListSortingStrategy}
              >
                <AnimatePresence mode="popLayout">
                  {filteredCards.map((card) => (
                    <ColumnCard key={card.id} card={card} />
                  ))}
                </AnimatePresence>
              </SortableContext>
            ) : (
              <div className="border-gray-00 flex min-h-[120px] items-center justify-center rounded-lg border-2 border-dashed text-sm dark:border-gray-600">
                Drop cards here
              </div>
            )}
          </div>

          <button
            onClick={handleAddCard}
            className="flex items-center gap-2 rounded-b-xl border-t border-gray-200 px-4 py-3 text-sm font-medium transition-colors duration-200 hover:bg-white/30 dark:border-gray-700"
          >
            <Plus className="size-4" />
            Add card
          </button>
        </div>
      </motion.div>
    </ColumnContextMenu>
  );
}
