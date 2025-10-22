import { useEffect, useMemo, useState } from "react";
import NestlingTitle from "@/components/editors/NestlingTitle";
import { useBoardStore } from "@/stores/useBoardStore";
import Column from "@/components/editors/board/Column";
import { AnimatePresence } from "framer-motion";
import useAutoSave from "@/hooks/useAutoSave";

import {
  DndContext,
  rectIntersection,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import useActiveNestling from "@/hooks/useActiveNestling";
import { useNestlingStore } from "@/stores/useNestlingStore";

export default function BoardEditor() {
  const { activeNestling, activeNestlingId } = useActiveNestling();
  const { updateNestling } = useNestlingStore();

  if (!activeNestling) return;

  const [title, setTitle] = useState(activeNestling.title);
  const { boardData, fetchBoard, addColumn, handleDragStart, handleDragEnd } =
    useBoardStore();

  const columns = boardData?.columns || [];
  const columnIds = columns.map((col) => `column-${col.column.id}`);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const handleAddColumn = async () => {
    try {
      addColumn({
        nestling_id: activeNestlingId!,
        title: "New Column",
        order_index: boardData!.columns.length + 1,
      });
    } catch (error) {
      console.error("Error adding column:", error);
    }
  };

  useEffect(() => {
    fetchBoard(activeNestlingId!);
  }, [fetchBoard, activeNestlingId]);

  useEffect(() => {
    setTitle(activeNestling.title);
  }, [activeNestling.title]);

  useAutoSave({
    target: activeNestling,
    currentData: useMemo(
      () => ({
        title,
        folder_id: activeNestling.folder_id ?? null,
      }),
      [activeNestling.folder_id, title],
    ),

    saveFunction: (id, data) => updateNestling(id, data),
  });

  return (
    <div className="flex h-full flex-col gap-3">
      <NestlingTitle title={title} setTitle={setTitle} />

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
            <div className="flex flex-row items-start gap-4">
              <AnimatePresence>
                {columns.map((col) => (
                  <Column key={col.column.id} {...col} />
                ))}
              </AnimatePresence>

              <button
                onClick={handleAddColumn}
                className="w-72 flex-shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 py-5 text-gray-400 dark:border-gray-600 dark:text-gray-500"
              >
                + Add column
              </button>
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
