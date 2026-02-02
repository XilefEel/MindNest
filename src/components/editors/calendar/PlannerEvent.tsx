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
    const newHour = Math.max(0, Math.min(23, Math.round(absoluteY / 64)));

    const baseWeekDate = startOfWeek(new Date(event.date));
    const newDate = getDateFromWeekDay(baseWeekDate, newDay);

    updateEvent(event.id, {
      date: newDate,
      startTime: newHour,
    });
  };

  const onResizeStop = (e: any, dir: any, ref: any, delta: any) => {
    console.log(e);

    const newDuration = Math.round(ref.offsetHeight / 64);

    if (dir === "top") {
      const movedHours = Math.round(delta.height / 64);
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
            top: event.startTime * 64,
            height: event.duration * 64,
          }}
        />
      </PopoverTrigger>

      <PlannerEventContextMenu event={event}>
        <Rnd
          key={event.id}
          size={{ width: "100%", height: event.duration * 64 }}
          minWidth="100%"
          maxWidth="100%"
          position={{
            x: 0,
            y: event.startTime * 64,
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
          className="absolute z-10 rounded-lg border border-none p-2 text-sm shadow-lg"
          style={{
            backgroundColor: event.color,
          }}
          onClick={() => setIsOpen(true)}
        >
          <h3 className="cursor-pointer rounded px-1 py-0.5 font-semibold">
            {event.title}
          </h3>
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
