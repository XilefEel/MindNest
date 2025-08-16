import { Trash } from "lucide-react";
import { Button } from "../ui/button";
import { BoardCard } from "@/lib/types";
import { useBoardStore } from "@/stores/useBoardStore";
import { useEffect, useRef, useState } from "react";

export default function ColumnCard(card: BoardCard) {
  const { updateCard, removeCard } = useBoardStore();
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || "");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  const titleRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLInputElement>(null);

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

  const handleSubmit = async () => {
    const newTitle = title.trim();
    const newDescription = description.trim();

    // Update if either changed
    if (
      (newTitle && newTitle !== card.title) ||
      newDescription !== (card.description || "")
    ) {
      try {
        await updateCard(card.id, newTitle, newDescription, card.order_index);
      } catch (err) {
        console.error("Failed to update card:", err);
      }
    }

    setIsEditingTitle(false);
    setIsEditingDescription(false);
  };

  return (
    <div className="flex items-center justify-between rounded bg-white p-3 shadow-sm hover:shadow">
      <div>
        {isEditingTitle ? (
          <input
            ref={titleRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleSubmit}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
              if (e.key === "Escape") {
                setTitle(card.title);
                setIsEditingTitle(false);
              }
            }}
            className="w-full rounded bg-transparent outline-none focus:ring-0 focus:outline-none"
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
              if (e.key === "Enter") handleSubmit();
              if (e.key === "Escape") {
                setDescription(card.description || "");
                setIsEditingDescription(false);
              }
            }}
            className="w-full rounded bg-transparent outline-none focus:ring-0 focus:outline-none"
          />
        ) : (
          <p
            className="mt-1 cursor-pointer text-sm text-gray-600"
            onClick={() => setIsEditingDescription(true)}
          >
            {description || (
              <span className="text-gray-400">Add description…</span>
            )}
          </p>
        )}
      </div>
      <Button
        variant={"ghost"}
        onClick={() => removeCard(card.id)}
        className="cursor-pointer rounded-lg p-1 text-red-500 transition duration-200 hover:bg-red-100 focus-visible:ring-red-400"
      >
        <Trash />
      </Button>
    </div>
  );
}
