import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BoardCard } from "@/lib/types/board";
import { useBoardStore } from "@/stores/useBoardStore";
import { useEffect, useRef, useState } from "react";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { motion } from "framer-motion";
import CardContextMenu from "@/components/context-menu/CardContextMenu";

export default function ColumnCard(card: BoardCard) {
  const { updateCard, removeCard } = useBoardStore();
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || "");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  const titleRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLInputElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `card-${card.id}-column-${card.column_id}`,
  });

  const { activeDraggingId } = useBoardStore();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
  };

  const handleKeyDown = (
    e: React.KeyboardEvent,
    type: "title" | "description",
  ) => {
    if (e.key === "Enter") handleSubmit();
    if (e.key === "Escape") {
      if (type === "title") {
        setTitle(card.title);
        setIsEditingTitle(false);
      } else {
        setDescription(card.description || "");
        setIsEditingDescription(false);
      }
    }
  };

  const handleSubmit = async () => {
    const newTitle = title.trim();
    const newDescription = description.trim();

    if (
      (newTitle && newTitle !== card.title) ||
      newDescription !== (card.description || "")
    ) {
      try {
        await updateCard({
          id: card.id,
          title: newTitle,
          description: newDescription,
          order_index: card.order_index,
          column_id: card.column_id,
        });
      } catch (err) {
        console.error("Failed to update card:", err);
      }
    }
    setIsEditingTitle(false);
    setIsEditingDescription(false);
  };

  useEffect(() => {
    if (isEditingTitle && titleRef.current) {
      titleRef.current.focus();
    }
    if (isEditingDescription && descRef.current) {
      descRef.current.focus();
    }
  }, [isEditingTitle, isEditingDescription]);

  useEffect(() => {
    setTitle(card.title);
    setDescription(card.description || "");
  }, [card.title, card.description]);

  return (
    <CardContextMenu card={card}>
      <motion.div
        key={card.id}
        layout={activeDraggingId == null}
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
          transition: {
            type: "spring",
            stiffness: 400,
            damping: 28,
          },
        }}
        exit={{
          opacity: 0,
          scale: 0.8,
          transition: { duration: 0.15 },
        }}
        className="flex flex-1 flex-col px-3 py-2"
      >
        <div
          ref={setNodeRef}
          style={style}
          className="flex items-center justify-between rounded bg-white p-3 shadow-sm hover:shadow dark:bg-gray-700"
        >
          <div
            {...attributes}
            {...listeners}
            className="flex-1 cursor-grab active:cursor-grabbing"
          >
            {isEditingTitle ? (
              <input
                ref={titleRef}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleSubmit}
                onKeyDown={(e) => {
                  handleKeyDown(e, "title");
                }}
                className="w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm font-medium outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-800"
              />
            ) : (
              <h3
                className="cursor-pointer font-semibold"
                onClick={() => setIsEditingTitle(true)}
              >
                {card.title}
              </h3>
            )}

            {isEditingDescription ? (
              <input
                ref={descRef}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={handleSubmit}
                onKeyDown={(e) => {
                  handleKeyDown(e, "description");
                }}
                className="w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm font-medium outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-800"
              />
            ) : (
              <p
                className="mt-1 cursor-pointer text-sm text-gray-600 dark:text-gray-300"
                onClick={() => setIsEditingDescription(true)}
              >
                {description || (
                  <span className="text-gray-300">Add description…</span>
                )}
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            onClick={() => removeCard(card.id)}
            className="cursor-pointer rounded-lg p-1 text-red-500 transition duration-200 hover:bg-red-100 focus-visible:ring-red-400 dark:hover:bg-red-200"
          >
            <Trash />
          </Button>
        </div>
      </motion.div>
    </CardContextMenu>
  );
}
