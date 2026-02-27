import { Maximize, Minus, Plus } from "lucide-react";
import { useViewport, useStore, useReactFlow } from "@xyflow/react";
import { Slider } from "@/components/ui/slider";

export default function ZoomSlider() {
  const { zoom } = useViewport();
  const { zoomTo, zoomIn, zoomOut, fitView } = useReactFlow();
  const minZoom = useStore((state) => state.minZoom);
  const maxZoom = useStore((state) => state.maxZoom);
  return (
    <div className="flex gap-1.5">
      <button
        onClick={() => zoomOut({ duration: 300 })}
        className="rounded-lg px-2.5 py-2 transition hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
      >
        <Minus size={16} />
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
        className="rounded-lg px-2.5 py-2 transition hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
      >
        <Plus size={16} />
      </button>

      <button
        className="flex w-18 items-center justify-center rounded-lg py-2 transition hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
        onClick={() => zoomTo(1, { duration: 300 })}
      >
        <span className="text-sm">
          {(100 * zoom).toFixed(0)}
          <span className="text-xs">%</span>
        </span>
      </button>

      <button
        onClick={() => fitView({ duration: 300 })}
        className="rounded-lg px-2.5 py-2 transition hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
      >
        <Maximize size={16} />
      </button>
    </div>
  );
}
