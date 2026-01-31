import { BoardCard } from "@/lib/types/board";
import { cn } from "@/lib/utils/general";
import { useBoardActions } from "@/stores/useBoardStore";
import { useActiveBackgroundId } from "@/stores/useNestStore";
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
  const [isSaving, setIsSaving] = useState(false);
  const { updateCard } = useBoardActions();

  const activeBackgroundId = useActiveBackgroundId();

  const hasChanges =
    title.trim() !== card.title ||
    description.trim() !== (card.description || "");

  const handleSubmit = async () => {
    const newTitle = title.trim();
    const newDescription = description.trim();

    if (!newTitle) return;

    if (!hasChanges) {
      onClose();
      return;
    }

    setIsSaving(true);
    try {
      await updateCard({
        id: card.id,
        title: newTitle,
        description: newDescription || null,
        orderIndex: card.orderIndex,
        columnId: card.columnId,
      });
      onClose();
    } catch (err) {
      console.error("Failed to update card:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300">
          Title
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isSaving}
          autoFocus
          className={cn(
            "w-full rounded-lg border px-3 py-2 text-sm transition-colors outline-none focus:ring-2 disabled:cursor-default disabled:opacity-50",
            "bg-white text-black placeholder-gray-400",
            "shadow-sm hover:shadow focus:shadow-md",
            "focus:border-teal-500 focus:ring-teal-500",
            "dark:bg-gray-700 dark:text-gray-100",
            "dark:focus:border-teal-400 dark:focus:ring-teal-400",
            activeBackgroundId &&
              "border-0 bg-white/10 backdrop-blur-sm dark:bg-black/10",
          )}
          placeholder="Title..."
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isSaving}
          rows={6}
          className={cn(
            "w-full resize-none rounded-lg border px-3 py-2 text-sm transition-colors outline-none focus:ring-2 disabled:cursor-default disabled:opacity-50",
            "bg-white text-black placeholder-gray-400",
            "shadow-sm hover:shadow focus:shadow-md",
            "focus:border-teal-500 focus:ring-teal-500",
            "dark:bg-gray-700 dark:text-gray-100",
            "dark:focus:border-teal-400 dark:focus:ring-teal-400",
            activeBackgroundId &&
              "border-0 bg-white/10 backdrop-blur-sm dark:bg-black/10",
          )}
          placeholder="Add a description..."
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          onClick={onClose}
          disabled={isSaving}
          className="cursor-pointer rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 disabled:cursor-default disabled:opacity-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSaving || !title.trim() || !hasChanges}
          className="cursor-pointer rounded-lg bg-teal-500 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-teal-600 disabled:cursor-default disabled:opacity-50 disabled:hover:bg-teal-500 dark:bg-teal-600 dark:hover:bg-teal-500"
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
