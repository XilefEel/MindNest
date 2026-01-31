import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BoardCard } from "@/lib/types/board";
import { setActiveDraggingId, useBoardActions } from "@/stores/useBoardStore";
import { useEffect, useRef, useState } from "react";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { motion } from "framer-motion";
import CardContextMenu from "@/components/context-menu/CardContextMenu";

export default function ColumnCard({ card }: { card: BoardCard }) {
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || "");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  const { updateCard, deleteCard } = useBoardActions();

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
    id: card.id,
    data: {
      type: "card",
      card: card,
    },
  });

  const style = {
    // transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
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
          orderIndex: card.orderIndex,
          columnId: card.columnId,
        });
      } catch (err) {
        console.error("Failed to update card:", err);
      }
    }

    setIsEditingTitle(false);
    setIsEditingDescription(false);
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
      // initial={{ opacity: 0, height: 0 }}
      // animate={{ opacity: 1, height: "auto" }}
      // exit={{ opacity: 0, height: 0 }}
      // transition={{ duration: 0.15 }}
      >
        <div className="px-2 py-1.5">
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
                  onDoubleClick={() => setIsEditingTitle(true)}
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
                  onDoubleClick={() => setIsEditingDescription(true)}
                >
                  {description || (
                    <span className="text-gray-300">Add description…</span>
                  )}
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              onClick={handleDelete}
              className="cursor-pointer rounded-lg p-1 text-red-500 transition duration-200 hover:bg-red-100 focus-visible:ring-red-400 dark:hover:bg-red-200"
            >
              <Trash />
            </Button>
          </div>
        </div>
      </motion.div>
    </CardContextMenu>
  );
}
