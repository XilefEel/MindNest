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
        className="rounded-lg transition-all hover:scale-105 hover:bg-gray-100/50 active:scale-98 dark:hover:bg-gray-800/50"
        title="Zoom Out"
      >
        <Minus />
      </Button>

      <div className="flex items-center px-2">
        <Slider
          className="[&_[data-slot=slider-range]]:bg-primary w-[120px] [&_[data-slot=slider-thumb]]:size-4 [&_[data-slot=slider-thumb]]:border-2 [&_[data-slot=slider-thumb]]:shadow-md [&_[data-slot=slider-thumb]]:transition-transform hover:[&_[data-slot=slider-thumb]]:scale-110 [&_[data-slot=slider-track]]:h-2 [&_[data-slot=slider-track]]:bg-gray-400/50 [&_[data-slot=slider-track]]:dark:bg-gray-600/50"
          value={[zoom]}
          min={minZoom}
          max={maxZoom}
          step={0.01}
          onValueChange={(values) => zoomTo(values[0])}
        />
      </div>

      <Button
        variant="ghost"
        onClick={() => zoomIn({ duration: 300 })}
        className="rounded-lg transition-all hover:scale-105 hover:bg-gray-100/50 active:scale-98 dark:hover:bg-gray-800/50"
        title="Zoom In"
      >
        <Plus />
      </Button>

      <Button
        className="rounded-lg transition-all hover:scale-105 hover:bg-gray-100/50 active:scale-98 dark:hover:bg-gray-800/50"
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
        className="rounded-lg transition-all hover:scale-105 hover:bg-gray-100/50 active:scale-98 dark:hover:bg-gray-800/50"
      >
        <Maximize />
      </Button>
    </div>
  );
}
