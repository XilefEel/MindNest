import { Button } from "@/components/ui/button";
import {
  cn,
  getDayFromDate,
  PLANNER_EVENT_COLORS,
  getRandomElement,
} from "@/lib/utils";
import { addDays, format, startOfWeek } from "date-fns";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import PlannerEvent from "./PlannerEvent";
import { usePlannerStore } from "@/stores/usePlannerStore";
import { NewPlannerEventType } from "@/lib/types";
import { useNestlingTreeStore } from "@/stores/useNestlingStore";

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
  setMode,
  setDirection,
}: {
  selectedDate: Date;
  variants: any;
  setMode: (mode: "calendar" | "planner") => void;
  setDirection: (direction: number) => void;
}) {
  const colRef = useRef<HTMLDivElement>(null);
  const [colWidth, setColWidth] = useState(1);

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 }); // 0 = Sunday
  const weekDaysWithDates = Array.from({ length: 7 }, (_, i) =>
    addDays(weekStart, i),
  );

  const { activeNestling } = useNestlingTreeStore();
  if (!activeNestling) return null;
  const { events, addEvent } = usePlannerStore();

  const handleDoubleClick = ({
    clickedDate,
    startHour,
  }: {
    clickedDate: Date;
    startHour: number;
  }) => {
    const newEvent: NewPlannerEventType = {
      nestling_id: activeNestling.id,
      date: format(clickedDate, "yyyy-MM-dd"),
      title: format(clickedDate, "yyyy-MM-dd"),
      description: null,
      start_time: startHour,
      duration: 1,
      color: getRandomElement(PLANNER_EVENT_COLORS),
    };
    console.log(newEvent);
    addEvent(newEvent);
  };

  useEffect(() => {});
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
      className="absolute h-full w-full p-6"
    >
      <div className="flex items-center justify-between py-1">
        <Button
          onClick={() => {
            setMode("calendar");
            setDirection(1);
          }}
        >
          <ArrowLeft />
        </Button>
      </div>

      {/* Planner Grid */}
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
            className="relative border-r border-gray-300 dark:border-gray-600"
          >
            <div className="relative grid grid-rows-24">
              {Array.from({ length: 24 }, (_, hour) => (
                <div
                  key={hour}
                  className={cn(
                    "h-16 border-t border-gray-200 dark:border-gray-700",
                    hour % 2 === 0 && "bg-white/50 dark:bg-gray-800/50",
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
