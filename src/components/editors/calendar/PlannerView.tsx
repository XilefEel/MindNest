import { getDayFromDate } from "@/lib/utils/date";
import { cn, getRandomElement } from "@/lib/utils/general";
import { addDays, format, isSameDay, startOfWeek } from "date-fns";
import { useEffect, useRef, useState } from "react";
import PlannerEvent from "./PlannerEvent";
import { useEvents, usePlannerActions } from "@/stores/usePlannerStore";
import { NewPlannerEventType } from "@/lib/types/calendar";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import { COLORS, gridHeight } from "@/lib/utils/constants";
import { useActiveNestling } from "@/stores/useNestlingStore";

export default function PlannerView({ selectedDate }: { selectedDate: Date }) {
  const activeNestling = useActiveNestling();
  if (!activeNestling) return;

  const { createEvent } = usePlannerActions();
  const events = useEvents();

  const colRef = useRef<HTMLDivElement>(null);
  const [colWidth, setColWidth] = useState(1);

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 }); // 0 = Sunday

  const weekDaysWithDates = Array.from({ length: 7 }, (_, i) =>
    addDays(weekStart, i),
  );

  const activeBackgroundId = useActiveBackgroundId();

  const handleDoubleClick = ({
    clickedDate,
    startHour,
  }: {
    clickedDate: Date;
    startHour: number;
  }) => {
    const newEvent: NewPlannerEventType = {
      nestlingId: activeNestling.id,
      date: format(clickedDate, "yyyy-MM-dd"),
      title: "New Event",
      description: null,
      startTime: startHour,
      duration: 1,
      color: getRandomElement(COLORS),
    };
    createEvent(newEvent);
  };

  useEffect(() => {
    if (!colRef.current) return;

    const updateWidth = () => {
      if (!colRef.current) return;
      setColWidth(colRef.current.offsetWidth / 7);
    };

    updateWidth();

    const observer = new ResizeObserver(() => updateWidth());
    observer.observe(colRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="absolute h-full w-full px-6">
      <div ref={colRef} className="grid h-full grid-cols-7 items-center">
        {weekDaysWithDates.map((day) => (
          <div className="flex flex-col gap-1 py-4 text-center font-medium">
            <div
              className={cn(
                "text-xs text-gray-500",
                isSameDay(day, new Date()) &&
                  "text-teal-500 dark:text-teal-400",
              )}
            >
              {format(day, "EEE")}
            </div>
            <div
              className={cn(
                "mx-auto flex h-8 w-8 items-center justify-center text-2xl",
                isSameDay(day, new Date()) &&
                  "rounded-full bg-teal-500 p-5 text-white",
              )}
            >
              {format(day, "d")}
            </div>
          </div>
        ))}

        {weekDaysWithDates.map((day, dayIndex) => (
          <div
            key={day.toISOString()}
            className={cn(
              "relative border-r border-gray-300 dark:border-gray-600",
              activeBackgroundId &&
                "border-gray-300/30 dark:border-gray-600/30",
            )}
          >
            <div className="relative grid grid-rows-24">
              {Array.from({ length: 24 }, (_, hour) => (
                <div
                  key={hour}
                  style={{ height: gridHeight * 4 }}
                  className={cn(
                    "border-t",
                    activeBackgroundId
                      ? "border-gray-200/30 dark:border-gray-700/30"
                      : "border-gray-200 dark:border-gray-700",
                    hour % 2 === 0 &&
                      (activeBackgroundId
                        ? "bg-white/20 dark:bg-black/20"
                        : "bg-gray-100 dark:bg-gray-800/50"),
                  )}
                  onDoubleClick={() => {
                    handleDoubleClick({
                      clickedDate: day,
                      startHour: hour,
                    });
                  }}
                >
                  {dayIndex === 0 && (
                    <div className="absolute -mt-2 -ml-12 text-xs text-gray-500 dark:text-white">
                      {hour}:00
                    </div>
                  )}
                </div>
              ))}
            </div>

            {events
              .filter((event) => getDayFromDate(event.date) === dayIndex)
              .map((event) => (
                <PlannerEvent
                  key={event.id}
                  event={event}
                  colWidth={colWidth}
                />
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
