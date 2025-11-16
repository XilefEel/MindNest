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
  rectIntersection,
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
import { getRandomElement } from "@/lib/utils/general";
import ColumnCard from "./ColumnCard";
import { createPortal } from "react-dom";

export default function BoardEditor() {
  const activeNestling = useActiveNestling();
  if (!activeNestling) return;

  const columns = useBoardColumns();
  const cards = useBoardCards();
  const activeDraggingId = useActiveDraggingId();
  const { getBoard, createColumn, handleDragStart, handleDragEnd } =
    useBoardActions();

  const { updateNestling } = useNestlingActions();

  const [title, setTitle] = useState(activeNestling.title);

  const columnIds = columns.map((col) => col.id);
  const activeCard = cards.find((card) => card.id === Number(activeDraggingId));

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const handleAddColumn = async () => {
    try {
      createColumn({
        nestlingId: activeNestling.id!,
        title: `New Column ${columns.length + 1}`,
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
          collisionDetection={rectIntersection}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={columnIds}
            strategy={horizontalListSortingStrategy}
          >
            <div className="flex flex-row items-start gap-4 p-2">
              {columns.map((col) => (
                <Column key={col.id} column={col} />
              ))}

              <button
                onClick={handleAddColumn}
                className="w-72 flex-shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 py-5 text-gray-400 dark:border-gray-600 dark:text-gray-500"
              >
                + Add column
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
