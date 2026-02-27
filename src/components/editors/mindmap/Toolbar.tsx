import { Trash2, CirclePlus } from "lucide-react";
import { Panel } from "@xyflow/react";
import ZoomSlider from "./ZoomSlider";

export default function MindmapToolbar({
  onAddNode,
  onDeleteAll,
}: {
  onAddNode: () => void;
  onDeleteAll: () => void;
}) {
  return (
    <Panel className="flex items-center gap-2 rounded-xl bg-white/50 p-1 font-medium shadow-lg backdrop-blur-sm transition dark:bg-gray-900/50">
      <div className="flex gap-1.5">
        <button
          onClick={onAddNode}
          className="flex items-center justify-center gap-2 rounded-lg px-3 py-2 transition hover:bg-teal-100/50 hover:text-teal-500 active:scale-98 dark:hover:bg-teal-700/20"
        >
          <CirclePlus size={16} />
          <span className="text-sm font-medium">Add Node</span>
        </button>

        <button
          onClick={onDeleteAll}
          className="flex items-center justify-center gap-2 rounded-lg px-3 py-2 transition hover:bg-red-100/50 hover:text-red-500 active:scale-98 dark:hover:bg-red-900/20"
        >
          <Trash2 size={16} />
          <span className="text-sm font-medium">Delete All</span>
        </button>
      </div>

      <ZoomSlider />
    </Panel>
  );
}
