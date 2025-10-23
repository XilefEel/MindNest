import { Button } from "@/components/ui/button";
import { Trash, Plus } from "lucide-react";
import { useBoardStore } from "@/stores/useBoardStore";
import ColumnCard from "./ColumnCard";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSortable } from "@dnd-kit/sortable";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { toast } from "sonner";
import { BoardColumnData } from "@/lib/types/board";

export default function Column(col: BoardColumnData) {
  const { addCard, updateColumn, removeColumn, activeDraggingId } =
    useBoardStore();
  const [title, setTitle] = useState(col.column.title);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `column-${col.column.id}`,
  });

  const style = {
    transform: transform ? `translateX(${transform.x}px)` : undefined,
    transition,
    opacity: isDragging ? 0.5 : 1,
    backgroundColor: col.column.color,
  };

  const cards = col.cards;
  const columnIds = cards.map(
    (card) => `card-${card.id}-column-${card.column_id}`,
  );

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    setTitle(col.column.title);
  }, [col.column.title]);

  const handleAddCard = async () => {
    try {
      addCard({
        column_id: col.column.id,
        title: "New Card",
        description: String(col.cards.length + 1),
        order_index: col.cards.length + 1,
      });
    } catch (error) {
      console.error("Error adding column:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      const newTitle = title.trim();
      if (newTitle && newTitle !== col.column.title) {
        await updateColumn({
          id: col.column.id,
          title: newTitle,
          order_index: col.column.order_index,
          color: col.column.color,
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
      setTitle(col.column.title);
      setIsEditing(false);
    }
  };

  return (
    <motion.div
      key={col.column.id}
      layout={activeDraggingId == null}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 25,
        },
      }}
      exit={{
        opacity: 0,
        scale: 0.9,
        y: 20,
        transition: { duration: 0.15 },
      }}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.15 },
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
              {col.column.title}
            </h3>
          )}

          <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium dark:bg-gray-700">
            {cards.length}
          </span>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeColumn(col.column.id)}
            className="size-8 text-red-400 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-950 dark:hover:text-red-400"
          >
            <Trash className="size-4" />
          </Button>
        </div>

        <div className="py-2">
          <SortableContext
            items={columnIds}
            strategy={verticalListSortingStrategy}
          >
            <AnimatePresence>
              {cards.map((card) => (
                <ColumnCard key={card.id} {...card} />
              ))}
            </AnimatePresence>
          </SortableContext>

          {cards.length === 0 && (
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
  );
}
