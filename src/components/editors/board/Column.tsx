import { BoardColumnData } from "@/lib/types/board";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useBoardStore } from "@/stores/useBoardStore";
import ColumnCard from "./ColumnCard";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { useSortable } from "@dnd-kit/sortable";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

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

  const handleSubmit = async () => {
    const newTitle = title.trim();
    if (newTitle && newTitle !== col.column.title) {
      await updateColumn({
        id: col.column.id,
        title: newTitle,
        order_index: col.column.order_index,
      })
        .then(() => {
          setIsEditing(false);
        })
        .catch((err) => console.error("Failed to update column:", err));
    }
  };

  return (
    <div
      key={col.column.id}
      ref={setNodeRef}
      style={style}
      className="flex w-72 flex-shrink-0 flex-col rounded-lg bg-teal-100 dark:bg-teal-500"
    >
      <div
        className="flex items-center justify-between p-3 font-semibold"
        {...listeners}
        {...attributes}
      >
        {isEditing ? (
          <input
            ref={inputRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleSubmit}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
              if (e.key === "Escape") {
                setTitle(col.column.title);
                setIsEditing(false);
              }
            }}
            className="w-full bg-transparent font-semibold outline-none focus:ring-0"
          />
        ) : (
          <h3
            className="cursor-pointer font-semibold"
            onClick={() => setIsEditing(true)}
          >
            {col.column.title}
          </h3>
        )}
        <Button
          variant={"ghost"}
          onClick={() => removeColumn(col.column.id)}
          className="cursor-pointer rounded-lg p-1 text-red-500 transition duration-200 hover:bg-red-100 focus-visible:ring-red-400 dark:hover:bg-red-200"
        >
          <Trash />
        </Button>
      </div>

      <SortableContext items={columnIds} strategy={verticalListSortingStrategy}>
        <AnimatePresence>
          {cards.map((card, idx) => (
            <motion.div
              key={card.id}
              layout={activeDraggingId == null}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{
                opacity: 0,
                scale: 0.8,
                y: 10,
                transition: { duration: 0.15 },
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
              }}
              className="flex flex-1 flex-col px-3 py-2"
            >
              <ColumnCard key={idx} {...card} />
            </motion.div>
          ))}
          {cards.length === 0 && (
            <div className="flex min-h-[100px] w-full items-center justify-center">
              + drop me here
            </div>
          )}
        </AnimatePresence>
      </SortableContext>

      <button
        onClick={() =>
          addCard({
            column_id: col.column.id,
            title: "New Card",
            description: String(col.cards.length + 1),
            order_index: col.cards.length + 1,
          })
        }
        className="cursor-pointer p-3 text-sm text-gray-500 transition-colors duration-200 hover:text-gray-700 dark:hover:text-gray-300"
      >
        + Add card
      </button>
    </div>
  );
}
