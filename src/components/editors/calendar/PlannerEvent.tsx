import { Rnd } from "react-rnd";
import { PlannerEventType } from "@/lib/types/calendar";
import { addDays, format, startOfWeek } from "date-fns";
import { getDayFromDate } from "@/lib/utils/date";
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

  const onDragStop = (d: any) => {
    const currentDay = getDayFromDate(event.date);
    const absoluteX = currentDay * colWidth + d.x;
    const absoluteY = d.y;

    const newDay = Math.max(0, Math.min(6, Math.round(absoluteX / colWidth)));

    const calculatedHour = Math.round(absoluteY / gridHeight);

    const newHour = Math.min(Math.max(0, calculatedHour), 24 - event.duration);

    const weekStart = startOfWeek(new Date(event.date));
    const newDate = format(addDays(weekStart, newDay), "yyyy-MM-dd");

    updateEvent(event.id, {
      date: newDate,
      startTime: newHour,
    });
  };

  const onResizeStop = (dir: any, ref: any, delta: any) => {
    if (dir === "top") {
      const heightChange = Math.round(delta.height / gridHeight);
      const newStartTime = event.startTime - heightChange;
      const newDuration = event.duration + heightChange;

      const finalStartTime = Math.max(0, newStartTime);

      const finalDuration =
        newStartTime < 0
          ? event.startTime + event.duration
          : Math.max(1, newDuration);

      updateEvent(event.id, {
        startTime: finalStartTime,
        duration: finalDuration,
      });
    } else {
      const newDuration = Math.round(ref.offsetHeight / gridHeight);
      const maxDuration = 24 - event.startTime;

      const finalDuration = Math.min(newDuration, maxDuration);

      updateEvent(event.id, {
        duration: Math.max(1, finalDuration),
      });
    }
  };

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
          className={cn(
            "absolute z-10 rounded-lg px-3 text-sm tracking-wide text-white shadow-lg",
            event.duration > 1 && "py-2",
          )}
          style={{
            backgroundColor: event.color,
            zIndex: 10 + event.startTime,
          }}
          onClick={() => setIsOpen(true)}
        >
          <h3 className="truncate font-semibold">{event.title}</h3>
          <p className="text-xs text-gray-100">
            {format(new Date(0, 0, 0, event.startTime, 0), "h a")} -{" "}
            {format(
              new Date(0, 0, 0, event.startTime + event.duration, 0),
              "h a",
            )}
          </p>
        </Rnd>
      </PlannerEventContextMenu>

      <PopoverContent
        side="right"
        align="start"
        className={cn(
          "w-80 border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800",
          activeBackgroundId &&
            "border-0 bg-white/30 backdrop-blur-sm dark:bg-black/30",
        )}
      >
        <EventPopover event={event} onClose={() => setIsOpen(false)} />
      </PopoverContent>
    </Popover>
  );
}
