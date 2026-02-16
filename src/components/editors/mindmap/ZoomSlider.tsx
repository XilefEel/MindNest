import { Maximize, Minus, Plus } from "lucide-react";
import { useViewport, useStore, useReactFlow } from "@xyflow/react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

export default function ZoomSlider() {
  const { zoom } = useViewport();
  const { zoomTo, zoomIn, zoomOut, fitView } = useReactFlow();
  const minZoom = useStore((state) => state.minZoom);
  const maxZoom = useStore((state) => state.maxZoom);
  return (
    <div className="flex gap-1.5">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => zoomOut({ duration: 300 })}
        className="rounded-lg transition hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
      >
        <Minus />
      </Button>

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

      <Button
        variant="ghost"
        onClick={() => zoomIn({ duration: 300 })}
        className="rounded-lg transition hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
      >
        <Plus />
      </Button>

      <Button
        className="rounded-lg transition hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
        variant="ghost"
        onClick={() => zoomTo(1, { duration: 300 })}
      >
        <span className="text-sm">
          {(100 * zoom).toFixed(0)}
          <span className="text-xs">%</span>
        </span>
      </Button>

      <Button
        variant="ghost"
        onClick={() => fitView({ duration: 300 })}
        className="rounded-lg transition hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
      >
        <Maximize />
      </Button>
    </div>
  );
}
