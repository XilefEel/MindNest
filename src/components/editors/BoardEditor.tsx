import { useNestlingTreeStore } from "@/stores/useNestlingStore";
import { useState } from "react";
import NestlingTitle from "./NestlingTitle";

export default function BoardEditor() {
  const nestling = useNestlingTreeStore((s) => s.activeNestling);
  if (!nestling)
    return <div className="p-4 text-gray-500">No note selected</div>;

  const [title, setTitle] = useState(nestling.title);
  const columns = [
    { id: 1, title: "To Do", cards: ["Task 1", "Task 2"] },
    { id: 2, title: "In Progress", cards: ["Task 3"] },
    { id: 3, title: "Done", cards: ["Task 4", "Task 5", "Task 6"] },
  ];
  return (
    <div className="flex h-full flex-col">
      <NestlingTitle title={title} setTitle={setTitle} />

      {/* Board content */}
      <div className="flex-1 overflow-x-auto">
        <div className="flex flex-col items-start gap-4 md:flex-row">
          {columns.map((col) => (
            <div
              key={col.id}
              className="flex w-72 flex-shrink-0 flex-col rounded-lg bg-gray-100"
            >
              {/* Column header */}
              <div className="border-b p-3 font-semibold">{col.title}</div>

              {/* Cards */}
              <div className="flex flex-1 flex-col gap-3 p-3">
                {col.cards.map((card, idx) => (
                  <div
                    key={idx}
                    className="rounded bg-white p-3 shadow-sm hover:shadow"
                  >
                    {card}
                  </div>
                ))}
              </div>

              {/* Add card */}
              <button className="p-3 text-sm text-gray-500 hover:text-gray-700">
                + Add card
              </button>
            </div>
          ))}

          {/* Add column button */}
          <button className="w-72 flex-shrink-0 rounded-lg border border-dashed bg-gray-50 p-3 text-gray-500 hover:bg-gray-100">
            + Add column
          </button>
        </div>
      </div>
    </div>
  );
}
