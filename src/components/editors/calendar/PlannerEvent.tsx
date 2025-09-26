import { Rnd } from "react-rnd";

import { PlannerEventType } from "@/lib/types/calendar";
import { startOfWeek } from "date-fns";
import { getDateFromWeekDay, getDayFromDate } from "@/lib/utils/date";
import PlannerEventContextMenu from "@/components/context-menu/PlannerEventContextMenu";
import { useRef, useState } from "react";
import { usePlannerStore } from "@/stores/usePlannerStore";

export default function PlannerEvent({
  event,
  colWidth,
}: {
  event: PlannerEventType;
  colWidth: number;
}) {
  const [title, setTitle] = useState(event.title);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { updateEvent } = usePlannerStore();

  const handleSubmit = async () => {
    const newTitle = title.trim();
    if (newTitle && newTitle !== event.title) {
      await updateEvent({ ...event, title: newTitle }).catch((err) =>
        console.error("Failed to update event:", err),
      );
    }
    setIsEditing(false);
  };

  return (
    <PlannerEventContextMenu event={event}>
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

          // New day (0–6)
          const newDay = Math.max(
            0,
            Math.min(6, Math.round(absoluteX / colWidth)),
          );

          // New hour (0–23)
          const newHour = Math.max(0, Math.min(23, Math.round(absoluteY / 64)));

          // Convert newDay → new date
          const baseWeekDate = startOfWeek(new Date(event.date));
          const newDate = getDateFromWeekDay(baseWeekDate, newDay);

          updateEvent({ ...event, date: newDate, start_time: newHour });
        }}
        onResizeStop={(e, dir, ref, delta) => {
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
        className="absolute z-10 rounded-lg border border-none p-2 text-sm shadow-lg"
        style={{
          backgroundColor: event.color,
        }}
      >
        {isEditing ? (
          <input
            ref={inputRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleSubmit}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSubmit();
              }
              if (e.key === "Escape") {
                e.preventDefault();
                setTitle(event.title);
                setIsEditing(false);
              }
            }}
            className="w-full bg-transparent font-semibold transition-colors duration-200 outline-none focus:ring-0"
            autoFocus
            onFocus={(e) => e.target.select()}
          />
        ) : (
          <h3
            className="cursor-pointer rounded px-1 py-0.5 font-semibold transition-colors duration-150 hover:text-gray-700"
            onClick={() => {
              setIsEditing(true);
            }}
          >
            {event.title}
          </h3>
        )}
      </Rnd>
    </PlannerEventContextMenu>
  );
}
