import { AnimatePresence, motion } from "framer-motion";
import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { cn } from "@/lib/utils/general";
import { getWeekRange } from "@/lib/utils/date";
import { useNestStore } from "@/stores/useNestStore";
import { useNestlingStore } from "@/stores/useNestlingStore";
import { usePlannerStore } from "@/stores/usePlannerStore";

export default function MonthGrid({
  currentDate,
  direction,
  variants,
  setCurrentDate,
  setSelectedDate,
  setMode,
  setDirection,
}: {
  currentDate: Date;
  direction: number;
  variants: any;
  setCurrentDate: (date: Date) => void;
  setSelectedDate: (date: Date) => void;
  setMode: (mode: "calendar" | "planner") => void;
  setDirection: (direction: number) => void;
}) {
  const { activeBackgroundId } = useNestStore();
  const { activeNestling } = useNestlingStore();
  const { fetchEvents } = usePlannerStore();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days: Date[] = [];
  for (let day = startDate; day <= endDate; day = addDays(day, 1)) {
    days.push(day);
  }
  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  const goToNextMonth = () => {
    setDirection(1);
    setCurrentDate(addMonths(currentDate, 1));
  };

  const goToPreviousMonth = () => {
    setDirection(-1);
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: any,
  ) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset < -100 || velocity < -500) {
      goToNextMonth();
    } else if (offset > 100 || velocity > 500) {
      goToPreviousMonth();
    }
  };

  return (
    <AnimatePresence mode="sync" initial={false} custom={direction}>
      <motion.div
        key={format(currentDate, "yyyy-MM")}
        custom={direction}
        variants={variants}
        initial="monthEnter"
        animate="monthCenter"
        exit="monthExit"
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="absolute w-full space-y-2"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
      >
        {weeks.map((week, i) => (
          <div key={i} className="grid grid-cols-7 gap-2">
            {week.map((day) => (
              <div
                key={day.toString()}
                onClick={() => {
                  setSelectedDate(day);
                  setMode("planner");

                  const { start, end } = getWeekRange(day);
                  fetchEvents({
                    nestlingId: activeNestling!.id,
                    start,
                    end,
                  });
                }}
                className={cn(
                  "flex h-16 items-center justify-center rounded-lg transition duration-150 hover:bg-gray-100 dark:hover:bg-gray-800",
                  activeBackgroundId &&
                    "hover:bg-white/30 dark:hover:bg-black/30",
                  !isSameMonth(day, currentDate) && "text-gray-400",
                  isSameDay(day, new Date()) && "bg-teal-500 text-white",
                )}
              >
                {format(day, "d")}
              </div>
            ))}
          </div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
