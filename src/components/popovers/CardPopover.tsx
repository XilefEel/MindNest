import { BoardCard } from "@/lib/types/board";
import { cn } from "@/lib/utils/general";
import { toast } from "@/lib/utils/toast";
import { useBoardActions } from "@/stores/useBoardStore";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import { X } from "lucide-react";
import { useState } from "react";

export default function CardPopover({
  card,
  onClose,
}: {
  card: BoardCard;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || "");
  const { updateCard } = useBoardActions();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  const activeBackgroundId = useActiveBackgroundId();

  const handleSaveTitle = () => {
    if (!title.trim()) {
      setTitle(card.title);
      setIsEditingTitle(false);
      return;
    }

    const newTitle = title.trim();

    try {
      updateCard(card.id, { title: newTitle });
      setIsEditingTitle(false);
    } catch (error) {
      console.error("Failed to update card:", error);
      toast.error("Failed to update card title.");
      setTitle(card.title);
    }
  };

  const handleSaveDescription = () => {
    const newDescription = description.trim();
    try {
      updateCard(card.id, { description: newDescription });
      setIsEditingDescription(false);
    } catch (error) {
      console.error("Failed to update card:", error);
      toast.error("Failed to update card description.");
      setDescription(card.description || "");
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveTitle();
    } else if (e.key === "Escape") {
      setTitle(card.title);
      setIsEditingTitle(false);
    }
  };

  const handleDescriptionKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setDescription(card.description || "");
      setIsEditingDescription(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-1 pr-8">
        <div className="min-w-0 flex-1">
          {isEditingTitle ? (
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleTitleKeyDown}
              onBlur={handleSaveTitle}
              autoFocus
              className={cn(
                "w-full rounded border border-teal-500 px-2 py-1 text-lg font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-none",
                activeBackgroundId && "bg-white/30 dark:bg-black/30",
              )}
              placeholder="Event title"
            />
          ) : (
            <h3
              onClick={() => setIsEditingTitle(true)}
              className={cn(
                "truncate rounded px-2 py-1 text-lg font-semibold transition-colors hover:bg-gray-50 hover:text-teal-500 dark:hover:bg-gray-700 dark:hover:text-teal-400",
                activeBackgroundId &&
                  "hover:bg-white/30 hover:dark:bg-black/30",
              )}
            >
              {title}
            </h3>
          )}
        </div>

        <div className="min-w-0 flex-1">
          {isEditingDescription ? (
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={handleDescriptionKeyDown}
              onBlur={handleSaveDescription}
              autoFocus
              rows={6}
              className={cn(
                "w-full resize-none rounded border border-teal-500 px-2 py-1 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none",
                activeBackgroundId && "bg-white/30 dark:bg-black/30",
              )}
              placeholder="Add description..."
            />
          ) : (
            <p
              onClick={() => setIsEditingDescription(true)}
              className={cn(
                "line-clamp-3 rounded px-2 py-1 text-sm text-gray-700 transition-colors hover:bg-gray-50 hover:text-teal-500 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-teal-400",
                activeBackgroundId &&
                  "hover:bg-white/30 hover:dark:bg-black/30",
              )}
            >
              {description || (
                <span className="text-gray-400 italic">Add description...</span>
              )}
            </p>
          )}
        </div>
      </div>

      <button
        onClick={onClose}
        className={cn(
          "absolute top-4 right-4 rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 hover:dark:bg-gray-700 hover:dark:text-gray-200",
          activeBackgroundId && "hover:bg-white/30 hover:dark:bg-black/30",
        )}
      >
        <X size={18} />
      </button>
    </>
  );
}
