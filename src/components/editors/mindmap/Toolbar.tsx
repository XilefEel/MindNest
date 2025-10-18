import { Trash2, CirclePlus } from "lucide-react";
import { Panel } from "@xyflow/react";
import { Button } from "@/components/ui/button";
import ZoomSlider from "./ZoomSlider";

export default function MindmapToolbar({
  onAddNode,
  onDeleteAll,
}: {
  onAddNode: () => void;
  onDeleteAll: () => void;
}) {
  return (
    <Panel className="flex items-center gap-2 rounded-xl bg-white/50 p-1 shadow-lg backdrop-blur-sm transition-all duration-200 dark:bg-gray-900/50">
      <div className="flex gap-1.5">
        <Button
          variant="ghost"
          onClick={onAddNode}
          className="gap-2 rounded-lg px-3 transition-all hover:scale-105 hover:bg-teal-100/50 hover:text-teal-500 active:scale-98 dark:hover:bg-teal-700/20"
        >
          <CirclePlus />
          <span className="text-sm font-medium">Add Node</span>
        </Button>

        <Button
          variant="ghost"
          onClick={onDeleteAll}
          className="gap-2 rounded-lg px-3 transition-all hover:scale-105 hover:bg-red-100/50 hover:text-red-500 active:scale-98 dark:hover:bg-red-900/20"
        >
          <Trash2 />
          <span className="text-sm font-medium">Delete All</span>
        </Button>
      </div>

      <div className="w-px bg-gray-200 dark:bg-gray-700" />

      <ZoomSlider />
    </Panel>
  );
}
