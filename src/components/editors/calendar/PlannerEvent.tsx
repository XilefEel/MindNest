import { Rnd } from "react-rnd";

import { PlannerEventType } from "@/lib/types";
import { startOfWeek } from "date-fns";
import { getDateFromWeekDay, getDayFromDate } from "@/lib/utils";

export default function PlannerEvent({
  event,
  colWidth,
  updateEvent,
}: {
  event: PlannerEventType;
  colWidth: number;
  updateEvent: ({
    id,
    date,
    title,
    description,
    start_time,
    duration,
    color,
  }: {
    id: number;
    date: string;
    title: string;
    description: string | null;
    start_time: number;
    duration: number;
    color: string | null;
  }) => Promise<void>;
}) {
  return (
    <Rnd
      key={event.id}
      size={{ width: "100%", height: event.duration * 64 }}
      minWidth="100%"
      maxWidth={"100%"}
      position={{
        x: 0,
        y: event.start_time * 64,
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
      onDragStop={(e, d) => {
        const currentDay = getDayFromDate(event.date); // 0–6

        // Absolute positions
        const absoluteX = currentDay * colWidth + d.x;
        const absoluteY = d.y;

        // New position
        const newDay = Math.max(
          0,
          Math.min(6, Math.round(absoluteX / colWidth)),
        );
        const newHour = Math.max(0, Math.min(23, Math.round(absoluteY / 64)));

        // Convert newDay → new date (based on current week’s Sunday)
        const baseWeekDate = startOfWeek(new Date(event.date)); // Sunday of that week
        const newDate = getDateFromWeekDay(baseWeekDate, newDay);

        updateEvent({ ...event, date: newDate, start_time: newHour });
      }}
      onResizeStop={(e, dir, ref, delta, pos) => {
        const newDuration = Math.round(ref.offsetHeight / 64);

        if (dir === "top") {
          const movedHours = Math.round(delta.height / 64);
          updateEvent({
            ...event,
            start_time: event.start_time - movedHours,
            duration: event.duration + movedHours,
          });
        } else {
          updateEvent({ ...event, duration: newDuration });
        }
      }}
      className="absolute z-10 rounded-lg border border-teal-500 bg-teal-200 p-2 text-sm shadow-sm"
    >
      {event.title}
    </Rnd>
  );
}
