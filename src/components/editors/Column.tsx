import { BoardColumnData } from "@/lib/types";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import { useBoardStore } from "@/stores/useBoardStore";
import ColumnCard from "./ColumnCard";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function Column(col: BoardColumnData) {
  const { addCard, updateColumn, removeColumn } = useBoardStore();
  const [title, setTitle] = useState(col.column.title);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
      await updateColumn(col.column.id, newTitle, col.column.order_index)
        .then(() => {
          setIsEditing(false);
        })
        .catch((err) => console.error("Failed to update column:", err));
    }
  };

  return (
    <div
      key={col.column.id}
      className="flex w-72 flex-shrink-0 flex-col rounded-lg bg-gray-100"
    >
      <div className="flex items-center justify-between p-3 font-semibold">
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
            className="w-full bg-transparent font-semibold text-gray-900 outline-none focus:ring-0"
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
          className="cursor-pointer rounded-lg p-1 text-red-500 transition duration-200 hover:bg-red-100 focus-visible:ring-red-400"
        >
          <Trash />
        </Button>
      </div>

      <AnimatePresence>
        {col.cards.map((card, idx) => (
          <motion.div
            key={card.id}
            layout
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
      </AnimatePresence>

      <button
        onClick={() =>
          addCard({
            column_id: col.column.id,
            title: "New Card",
            description: String(col.cards.length + 1),
            order_index: col.cards.length + 1,
          })
        }
        className="cursor-pointer p-3 text-sm text-gray-500 transition-colors duration-200 hover:text-gray-700"
      >
        + Add card
      </button>
    </div>
  );
}
