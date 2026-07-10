import { Trash, Plus } from "lucide-react";
import { useSortable } from "@dnd-kit/react/sortable";
import { CollisionPriority } from "@dnd-kit/abstract";
import ColumnCard from "./ColumnCard";
import { useBoardActions } from "@/stores/useBoardStore";
import { toast } from "@/lib/utils/toast";
import { BoardColumn, BoardCard } from "@/lib/types/board";
import ColumnContextMenu from "@/components/context-menu/ColumnContextMenu";
import { useState, useRef, useEffect } from "react";

export default function Column({
  column,
  index,
  cards,
}: {
  column: BoardColumn;
  index: number;
  cards: BoardCard[];
}) {
  const [title, setTitle] = useState(column.title);
  const [isEditing, setIsEditing] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const { createCard, removeColumn, updateColumn } = useBoardActions();

  const { ref } = useSortable({
    id: column.id,
    accept: ["column", "card"],
    collisionPriority: CollisionPriority.Low,
    type: "column",
    index,
  });

  const handleAddCard = async () => {
    try {
      await createCard({
        columnId: column.id,
        title: "New Card",
        description: "",
        orderIndex: cards.length + 1,
      });
    } catch (error) {
      toast.error("Error adding card to column.");
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
        ref={ref as any}
        style={{ backgroundColor: column.color }}
        className="flex w-72 shrink-0 flex-col overflow-hidden rounded-2xl border border-black/5 shadow-lg"
      >
        <div className="flex items-center gap-1 bg-black/5 px-4 py-2.5 active:cursor-grabbing">
          {isEditing ? (
            <input
              ref={inputRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleSubmit}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              className="flex-1 rounded-lg border-0 bg-white px-3 py-1.5 text-sm font-semibold shadow-sm outline-none dark:bg-zinc-700"
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
            {cards.length}
          </span>

          <button
            onClick={() => removeColumn(column.id)}
            className="flex size-8 items-center justify-center rounded-lg text-white/80 transition hover:bg-black/10 hover:text-white"
          >
            <Trash className="size-4 shrink-0" />
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-2 px-2 py-3">
          {cards.length > 0 ? (
            cards.map((card, i) => (
              <ColumnCard
                key={card.id}
                card={card}
                columnId={column.id}
                index={i}
              />
            ))
          ) : (
            <div className="flex min-h-30 items-center justify-center rounded-xl border-2 border-dashed border-white/30 text-sm font-medium text-white/70">
              Drop cards here
            </div>
          )}
        </div>

        <button
          onClick={handleAddCard}
          className="flex items-center gap-2 bg-black/10 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-black/15"
        >
          <Plus className="size-4 shrink-0" />
          New
        </button>
      </div>
    </ColumnContextMenu>
  );
}
