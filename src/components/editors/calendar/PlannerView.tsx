import { getDayFromDate } from "@/lib/utils/date";
import { cn, getRandomElement } from "@/lib/utils/general";
import { addDays, format, startOfWeek } from "date-fns";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import PlannerEvent from "./PlannerEvent";
import { usePlannerStore } from "@/stores/usePlannerStore";
import { NewPlannerEventType } from "@/lib/types/calendar";
import { useNestStore } from "@/stores/useNestStore";
import useActiveNestling from "@/hooks/useActiveNestling";
import { COLORS } from "@/lib/utils/constants";

export type EventType = {
  id: number;
  title: string;
  day: number;
  startHour: number;
  duration: number;
};

export default function PlannerView({
  selectedDate,
  variants,
}: {
  selectedDate: Date;
  variants: any;
}) {
  const colRef = useRef<HTMLDivElement>(null);
  const [colWidth, setColWidth] = useState(1);

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 }); // 0 = Sunday
  const weekDaysWithDates = Array.from({ length: 7 }, (_, i) =>
    addDays(weekStart, i),
  );

  const { activeBackgroundId } = useNestStore();
  const { activeNestling } = useActiveNestling();
  const { events, createEvent } = usePlannerStore();

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
      title: format(clickedDate, "yyyy-MM-dd"),
      description: null,
      startTime: startHour,
      duration: 1,
      color: getRandomElement(COLORS),
    };
    console.log(newEvent);
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
    <motion.div
      key="planner"
      variants={variants}
      initial="plannerEnter"
      animate="plannerCenter"
      exit="plannerExit"
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="absolute h-full w-full px-6"
    >
      <div ref={colRef} className="grid h-full grid-cols-7">
        {weekDaysWithDates.map((day) => (
          <div className="py-2 text-center font-medium">
            <div className="text-xs text-gray-500">{format(day, "EEE")}</div>
            <div className="text-xl">{format(day, "d")}</div>
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
                  className={cn(
                    "h-16 border-t",
                    activeBackgroundId
                      ? "border-gray-200/30 dark:border-gray-700/30"
                      : "border-gray-200 dark:border-gray-700",
                    hour % 2 === 0 &&
                      (activeBackgroundId
                        ? "bg-white/20 dark:bg-black/20"
                        : "bg-white/20 dark:bg-gray-800/50"),
                  )}
                  onDoubleClick={() => {
                    handleDoubleClick({
                      clickedDate: day,
                      startHour: hour,
                    });
                    console.log({
                      day,
                      hour,
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
    </motion.div>
  );
}
