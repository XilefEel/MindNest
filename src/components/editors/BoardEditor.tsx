import { useNestlingTreeStore } from "@/stores/useNestlingStore";
import { useEffect, useState } from "react";
import NestlingTitle from "./NestlingTitle";
import { useBoardStore } from "@/stores/useBoardStore";
import Column from "./Column";
import { AnimatePresence, motion } from "framer-motion";

export default function BoardEditor() {
  const nestling = useNestlingTreeStore((s) => s.activeNestling);
  if (!nestling)
    return <div className="p-4 text-gray-500">No note selected</div>;

  const [title, setTitle] = useState(nestling.title);
  const { boardData, fetchBoard, addColumn } = useBoardStore();

  useEffect(() => {
    fetchBoard(nestling.id);
  }, [fetchBoard, nestling.id]);

  const columns = boardData?.columns || [];

  if (!boardData) {
    return <div>Board data not loaded yet...</div>;
  }

  return (
    <div className="flex h-full flex-col gap-3">
      <NestlingTitle title={title} setTitle={setTitle} />

      {/* Board content */}
      <div className="flex-1 overflow-x-auto">
        <div className="flex flex-col items-start gap-4 md:flex-row">
          <AnimatePresence>
            {columns.map((col) => (
              <motion.div
                key={col.column.id}
                layout="position"
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{
                  opacity: 0,
                  scale: 0.8,
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
            className="w-72 flex-shrink-0 cursor-pointer rounded-lg border border-dashed bg-gray-50 p-3 text-gray-500 transition duration-200 hover:bg-gray-100"
          >
            + Add column
          </button>
        </div>
      </div>
    </div>
  );
}
