import { useEffect, useMemo, useState } from "react";
import NestlingTitle from "@/components/editors/NestlingTitle";
import {
  useBoardActions,
  useBoardColumns,
  useCardsByColumn,
} from "@/stores/useBoardStore";
import Column from "@/components/editors/board/Column";
import useAutoSave from "@/hooks/useAutoSave";
import {
  useActiveNestling,
  useNestlingActions,
} from "@/stores/useNestlingStore";
import { COLORS } from "@/lib/utils/constants";
import { cn, getRandomElement } from "@/lib/utils/general";
import { Plus } from "lucide-react";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import { toast } from "@/lib/utils/toast";
import { DragDropProvider } from "@dnd-kit/react";

export default function BoardEditor() {
  const activeNestling = useActiveNestling();
  if (!activeNestling) return;

  const activeBackgroundId = useActiveBackgroundId();
  const columns = useBoardColumns();
  const cardsByColumn = useCardsByColumn();

  const {
    getBoard,
    createColumn,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  } = useBoardActions();
  const { updateNestling } = useNestlingActions();
  const [title, setTitle] = useState(activeNestling.title);

  const handleAddColumn = async () => {
    try {
      createColumn({
        nestlingId: activeNestling.id!,
        title: "New Column",
        orderIndex: columns.length + 1,
        color: getRandomElement(COLORS),
      });
    } catch (error) {
      toast.error("Error adding column.");
    }
  };

  const nestlingData = useMemo(() => ({ title }), [title]);
  useAutoSave(activeNestling.id!, nestlingData, updateNestling);

  useEffect(() => {
    getBoard(activeNestling.id!);
  }, [getBoard, activeNestling.id]);

  useEffect(() => {
    setTitle(activeNestling.title);
  }, [activeNestling.title]);

  return (
    <div className="flex h-full flex-col gap-3">
      <NestlingTitle
        title={title}
        setTitle={setTitle}
        nestling={activeNestling}
      />

      <DragDropProvider
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex h-full flex-row items-start gap-4 overflow-x-auto pt-2">
          {columns.map((col, i) => (
            <Column
              key={col.id}
              column={col}
              cards={cardsByColumn[col.id]}
              index={i}
            />
          ))}

          <button
            onClick={handleAddColumn}
            className={cn(
              "flex w-72 shrink-0 items-center justify-center gap-2 rounded-lg py-5 transition-colors",
              "text-zinc-600 dark:text-zinc-400",
              "border-2 border-dashed border-zinc-600 dark:border-zinc-400",
              "hover:bg-zinc-100 dark:hover:bg-zinc-800",
              activeBackgroundId && "hover:bg-black/5 dark:hover:bg-white/5",
            )}
          >
            <Plus size={16} />
            Add column
          </button>
        </div>
      </DragDropProvider>
    </div>
  );
}
