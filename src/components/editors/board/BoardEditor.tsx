import { useNestlingStore } from "@/stores/useNestlingStore";
import { useEffect, useMemo, useState } from "react";
import NestlingTitle from "@/components/editors/NestlingTitle";
import { useBoardStore } from "@/stores/useBoardStore";
import Column from "@/components/editors/board/Column";
import { AnimatePresence, motion } from "framer-motion";
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
import { editNote } from "@/lib/api/note";

export default function BoardEditor() {
  const nestling = useNestlingStore((s) => s.activeNestling);
  if (!nestling)
    return <div className="p-4 text-gray-500">No note selected</div>;

  const [title, setTitle] = useState(nestling.title);
  const {
    boardData,
    fetchBoard,
    addColumn,
    handleDragStart,
    handleDragEnd,
    activeDraggingId,
  } = useBoardStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  useEffect(() => {
    fetchBoard(nestling.id);
  }, [fetchBoard, nestling.id]);

  useEffect(() => {
    setTitle(nestling.title);
  }, [nestling.title]);

  useAutoSave({
    target: nestling,
    currentData: useMemo(() => ({ title }), [title]),
    saveFunction: (id, data) => editNote(id, data.title, ""),
  });

  const columns = boardData?.columns || [];
  const columnIds = columns.map((col) => `column-${col.column.id}`);

  if (!boardData) {
    return <div>Board data not loaded yet...</div>;
  }

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
                  <motion.div
                    key={col.column.id}
                    layout={activeDraggingId == null}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{
                      opacity: 0,
                      y: 30,
                      transition: { duration: 0.2 },
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 250,
                      damping: 25,
                    }}
                  >
                    <Column key={col.column.id} {...col} />
                  </motion.div>
                ))}
              </AnimatePresence>

              <button
                onClick={() => {
                  if (!boardData) {
                    console.log("Board data not loaded yet");
                    return;
                  }

                  addColumn({
                    nestling_id: nestling.id,
                    title: "New Column",
                    order_index: boardData.columns.length + 1,
                  });
                }}
                className="w-72 flex-shrink-0 cursor-pointer rounded-lg border border-dashed bg-gray-50 p-3 text-gray-500 transition duration-200 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
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
