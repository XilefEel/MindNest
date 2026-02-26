import { useEffect, useMemo, useState } from "react";
import NestlingTitle from "@/components/editors/NestlingTitle";
import {
  useActiveDraggingId,
  useBoardActions,
  useBoardCards,
  useBoardColumns,
} from "@/stores/useBoardStore";
import Column from "@/components/editors/board/Column";
import useAutoSave from "@/hooks/useAutoSave";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  useActiveNestling,
  useNestlingActions,
} from "@/stores/useNestlingStore";
import { COLORS } from "@/lib/utils/constants";
import { cn, getRandomElement } from "@/lib/utils/general";
import ColumnCard from "./ColumnCard";
import { createPortal } from "react-dom";
import { Plus } from "lucide-react";
import { useActiveBackgroundId } from "@/stores/useNestStore";

export default function BoardEditor() {
  const activeNestling = useActiveNestling();
  if (!activeNestling) return;

  const activeBackgroundId = useActiveBackgroundId();
  const columns = useBoardColumns();
  const cards = useBoardCards();
  const activeDraggingId = useActiveDraggingId();
  const {
    getBoard,
    createColumn,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
  } = useBoardActions();

  const { updateNestling } = useNestlingActions();

  const [title, setTitle] = useState(activeNestling.title);

  const columnIds = useMemo(() => columns.map((col) => col.id), [columns]);
  const activeCard = cards.find((card) => card.id === Number(activeDraggingId));

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
  );

  const handleAddColumn = async () => {
    try {
      createColumn({
        nestlingId: activeNestling.id!,
        title: "New Column",
        orderIndex: columns.length + 1,
        color: getRandomElement(COLORS),
      });
    } catch (error) {
      console.error("Error adding column:", error);
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
    <div className="relative flex h-full flex-col gap-3">
      <NestlingTitle
        title={title}
        setTitle={setTitle}
        nestling={activeNestling}
      />

      <div className="flex-1 overflow-x-auto overflow-y-visible">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragMove={handleDragMove}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={columnIds}
            strategy={horizontalListSortingStrategy}
          >
            <div className="flex flex-row items-start gap-4 pt-2">
              {columns.map((col) => (
                <Column key={col.id} column={col} />
              ))}

              <button
                onClick={handleAddColumn}
                className={cn(
                  "flex w-72 flex-shrink-0 items-center justify-center gap-2 rounded-lg py-5 transition-colors",
                  "text-gray-600 dark:text-gray-400",
                  "border-2 border-dashed border-gray-600 dark:border-gray-400",
                  "hover:bg-gray-100 hover:dark:bg-gray-800",
                  activeBackgroundId &&
                    "hover:bg-white/30 dark:hover:bg-black/10",
                )}
              >
                <Plus size={16} />
                Add column
              </button>
            </div>
          </SortableContext>

          {createPortal(
            <DragOverlay dropAnimation={null}>
              {activeCard && <ColumnCard card={activeCard} />}
            </DragOverlay>,
            document.body,
          )}
        </DndContext>
      </div>
    </div>
  );
}
