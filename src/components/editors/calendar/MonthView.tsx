import { AnimatePresence, motion } from "framer-motion";
import DateSelect from "./DateSelect";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
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
import { cn } from "@/lib/utils";

export default function MonthView({
  currentDate,
  setCurrentDate,
  selectedDate,
  setSelectedDate,
  setMode,
  direction,
  setDirection,
  variants,
}: {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  setMode: (mode: "calendar" | "planner") => void;
  direction: number;
  setDirection: (direction: number) => void;
  variants: any;
}) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const goToNextMonth = () => {
    setDirection(1);
    setCurrentDate(addMonths(currentDate, 1));
  };

  const goToPreviousMonth = () => {
    setDirection(-1);
    setCurrentDate(subMonths(currentDate, 1));
  };

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const days: Date[] = [];
  for (let day = startDate; day <= endDate; day = addDays(day, 1)) {
    days.push(day);
  }

  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  // Month sliding (uses direction)

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

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = Array.from({ length: 50 }, (_, i) => 2000 + i); // 2000–2049
  return (
    <motion.div
      key="calendar"
      variants={variants}
      initial="calendarEnter"
      animate="calendarCenter"
      exit="calendarExit"
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="absolute w-full"
    >
      <div className="mb-4 flex items-center justify-between border-b-2 border-teal-500 py-1">
        <DateSelect
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          setDirection={setDirection}
          years={years}
          months={months}
        />

        <div className="space-x-2">
          <Button onClick={goToPreviousMonth}>
            <ArrowLeft />
          </Button>
          <Button onClick={goToNextMonth}>
            <ArrowRight />
          </Button>
        </div>
      </div>

      <div className="mt-6 mb-2 grid grid-cols-7 text-center text-sm font-medium text-gray-500">
        {weekDays.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* month switching stays here */}
      <div className="relative min-h-[500px] overflow-hidden">
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
                    }}
                    className={cn(
                      "flex h-16 items-center justify-center rounded-lg transition duration-150 hover:bg-gray-100 dark:hover:bg-gray-800",
                      !isSameMonth(day, currentDate) && "text-gray-400",
                      isSameDay(day, new Date()) && "bg-teal-500 text-white",
                      isSameDay(day, selectedDate) && "border border-teal-500",
                    )}
                  >
                    {format(day, "d")}
                  </div>
                ))}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
