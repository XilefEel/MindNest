import { Rnd } from "react-rnd";
import { PlannerEventType } from "@/lib/types/calendar";
import { startOfWeek } from "date-fns";
import { getDateFromWeekDay, getDayFromDate } from "@/lib/utils/date";
import PlannerEventContextMenu from "@/components/context-menu/PlannerEventContextMenu";
import { usePlannerActions } from "@/stores/usePlannerStore";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import EventPopover from "./EventPopover";
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

  const onDragStop = (e: any, d: any) => {
    console.log(e);

    const currentDay = getDayFromDate(event.date);
    const absoluteX = currentDay * colWidth + d.x;
    const absoluteY = d.y;

    const newDay = Math.max(0, Math.min(6, Math.round(absoluteX / colWidth)));
    const newHour = Math.max(
      0,
      Math.min(23, Math.round(absoluteY / (gridHeight * 4))),
    );

    const baseWeekDate = startOfWeek(new Date(event.date));
    const newDate = getDateFromWeekDay(baseWeekDate, newDay);

    updateEvent(event.id, {
      date: newDate,
      startTime: newHour,
    });
  };

  const onResizeStop = (e: any, dir: any, ref: any, delta: any) => {
    console.log(e);

    const newDuration = Math.round(ref.offsetHeight / (gridHeight * 4));

    if (dir === "top") {
      const movedHours = Math.round(delta.height / (gridHeight * 4));
      updateEvent(event.id, {
        startTime: event.startTime - movedHours,
        duration: event.duration + movedHours,
      });
    } else {
      updateEvent(event.id, { duration: newDuration });
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div
          style={{
            position: "absolute",
            inset: 0,
            top: event.startTime * (gridHeight * 4),
            height: event.duration * (gridHeight * 4),
          }}
        />
      </PopoverTrigger>

      <PlannerEventContextMenu event={event}>
        <Rnd
          key={event.id}
          size={{ width: "100%", height: event.duration * (gridHeight * 4) }}
          minWidth="100%"
          maxWidth="100%"
          position={{
            x: 0,
            y: event.startTime * (gridHeight * 4),
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
          onDragStop={(e, d) => onDragStop(e, d)}
          onResizeStop={(e, dir, ref, delta) =>
            onResizeStop(e, dir, ref, delta)
          }
          className={cn(
            "absolute z-10 cursor-pointer rounded-lg px-3 text-sm text-white shadow-lg",
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
            {event.startTime}:00 - {event.startTime + event.duration}:00
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
