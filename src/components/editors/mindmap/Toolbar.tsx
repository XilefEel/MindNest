import { Slider } from "@/components/ui/slider";
import { Panel, useReactFlow, useStore, useViewport } from "@xyflow/react";
import { CirclePlus, Maximize, Minus, Plus, Trash2 } from "lucide-react";

export default function MindmapToolbar({
  onAddNode,
  onDeleteAll,
}: {
  onAddNode: () => void;
  onDeleteAll: () => void;
}) {
  const { zoom } = useViewport();
  const { zoomTo, zoomIn, zoomOut, fitView } = useReactFlow();
  const minZoom = useStore((state) => state.minZoom);
  const maxZoom = useStore((state) => state.maxZoom);

  return (
    <Panel className="flex items-center gap-1 rounded-xl bg-white/30 p-1 font-medium shadow-lg backdrop-blur-sm transition dark:bg-gray-900/30">
      <button
        onClick={onAddNode}
        className="flex items-center justify-center gap-2 rounded-lg px-3 py-2 transition hover:bg-teal-100/50 hover:text-teal-500 active:scale-98 dark:hover:bg-teal-700/20"
      >
        <CirclePlus className="size-4 flex-shrink-0" />
        <span className="text-xs font-medium">Add Node</span>
      </button>

      <button
        onClick={onDeleteAll}
        className="flex items-center justify-center gap-2 rounded-lg px-3 py-2 transition hover:bg-red-100/50 hover:text-red-500 active:scale-98 dark:hover:bg-red-900/20"
      >
        <Trash2 className="size-4 flex-shrink-0" />
        <span className="text-xs font-medium">Delete All</span>
      </button>

      <button
        onClick={() => zoomOut({ duration: 300 })}
        className="rounded-lg p-2 transition hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
      >
        <Minus className="size-4 flex-shrink-0" />
      </button>

      <div className="flex items-center px-2">
        <Slider
          className="w-24"
          min={minZoom}
          max={maxZoom}
          step={0.01}
          value={[zoom]}
          onValueChange={(values) => zoomTo(values[0])}
        />
      </div>

      <button
        onClick={() => zoomIn({ duration: 300 })}
        className="rounded-lg p-2 transition hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
      >
        <Plus className="size-4 flex-shrink-0" />
      </button>

      <button
        className="flex w-18 items-center justify-center rounded-lg py-2 transition hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
        onClick={() => zoomTo(1, { duration: 300 })}
      >
        <span className="text-xs">
          {(100 * zoom).toFixed(0)}
          <span className="text-2xs">%</span>
        </span>
      </button>

      <button
        onClick={() => fitView({ duration: 300 })}
        className="rounded-lg p-2 transition hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
      >
        <Maximize className="size-4 flex-shrink-0" />
      </button>
    </Panel>
  );
}
