import { Rnd } from "react-rnd";
import { PlannerEventType } from "@/lib/types/planner";
import { addDays, format, startOfWeek } from "date-fns";
import { formatTime, getDayFromDate } from "@/lib/utils/date";
import PlannerEventContextMenu from "@/components/context-menu/PlannerEventContextMenu";
import { usePlannerActions } from "@/stores/usePlannerStore";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import EventPopover from "../../popovers/EventPopover";
import { cn } from "@/lib/utils/general";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import { gridHeight } from "@/lib/utils/constants";
import { getBlurClass } from "@/lib/utils/settings";
import { useBlurStrength } from "@/stores/useSettingsStore";

export default function PlannerEvent({
  event,
  colWidth,
}: {
  event: PlannerEventType;
  colWidth: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { updateEvent } = usePlannerActions();

  const activeBackgroundId = useActiveBackgroundId();
  const blurStrength = useBlurStrength();

  const snapUnit = gridHeight / 4;

  const onDragStop = (d: any) => {
    const currentDay = getDayFromDate(event.date);
    const absoluteX = currentDay * colWidth + d.x;
    const absoluteY = d.y;

    const newDay = Math.max(0, Math.min(6, Math.round(absoluteX / colWidth)));

    const snappedY = Math.round(absoluteY / snapUnit) * snapUnit;
    const calculatedTime = snappedY / gridHeight;

    const newHour = Math.min(Math.max(0, calculatedTime), 24 - event.duration);

    const weekStart = startOfWeek(new Date(event.date));
    const newDate = format(addDays(weekStart, newDay), "yyyy-MM-dd");

    updateEvent(event.id, {
      date: newDate,
      startTime: newHour,
    });
  };

  const onResizeStop = (dir: any, ref: any, delta: any) => {
    if (dir === "top") {
      const heightChange = Math.round(delta.height / snapUnit) * snapUnit;
      const newStartTime = event.startTime - heightChange / gridHeight;
      const newDuration = event.duration + heightChange / gridHeight;

      const finalStartTime = Math.max(0, newStartTime);

      const finalDuration =
        newStartTime < 0
          ? event.startTime + event.duration
          : Math.max(0.25, newDuration);

      updateEvent(event.id, {
        startTime: finalStartTime,
        duration: finalDuration,
      });
    } else {
      const snappedHeight = Math.round(ref.offsetHeight / snapUnit) * snapUnit;
      const newDuration = snappedHeight / gridHeight;
      const maxDuration = 24 - event.startTime;

      const finalDuration = Math.min(newDuration, maxDuration);

      updateEvent(event.id, {
        duration: Math.max(0.25, finalDuration),
      });
    }
  };

  // Cannot use BasePopover because of the context menu and Rnd
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div
          style={{
            position: "absolute",
            inset: 0,
            top: event.startTime * gridHeight,
            height: event.duration * gridHeight,
          }}
        />
      </PopoverTrigger>

      <PlannerEventContextMenu event={event}>
        <Rnd
          key={event.id}
          size={{ width: "100%", height: event.duration * gridHeight }}
          minWidth="100%"
          maxWidth="100%"
          position={{
            x: 0,
            y: event.startTime * gridHeight,
          }}
          dragGrid={[colWidth, snapUnit]}
          resizeGrid={[1, snapUnit]}
          enableResizing={{
            top: true,
            right: false,
            bottom: true,
            left: false,
            topRight: false,
            bottomRight: false,
            bottomLeft: false,
            topLeft: false,
          }}
          onDragStop={(_, d) => onDragStop(d)}
          onResizeStop={(_, dir, ref, delta) => onResizeStop(dir, ref, delta)}
          onClick={() => setIsOpen(true)}
          style={{
            backgroundColor: event.color,
            zIndex: 10 + event.startTime,
          }}
          className={cn(
            "absolute z-10 rounded-lg px-2 text-sm tracking-wide text-white shadow-lg",
            event.duration > 1 && "py-1",
          )}
        >
          <h3 className="truncate font-semibold">{event.title}</h3>
          <p className="text-xs leading-tight text-gray-100">
            {event.duration < 1
              ? formatTime(event.startTime)
              : `${formatTime(event.startTime)} – ${formatTime(event.startTime + event.duration)}`}
          </p>
        </Rnd>
      </PlannerEventContextMenu>

      <PopoverContent
        side="right"
        align="start"
        className={cn(
          "w-80 border-gray-200 bg-white dark:border-zinc-700 dark:bg-zinc-800",
          activeBackgroundId &&
            cn(
              "border-transparent bg-white/30 dark:border-transparent dark:bg-black/30",
              getBlurClass(blurStrength),
            ),
        )}
      >
        <EventPopover event={event} onClose={() => setIsOpen(false)} />
      </PopoverContent>
    </Popover>
  );
}
