import { motion } from "framer-motion";
import DateSelect from "./DateSelect";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { addMonths, subMonths } from "date-fns";
import { useNestlingTreeStore } from "@/stores/useNestlingStore";
import MonthGrid from "./MonthGrid";
import { useState } from "react";

export default function MonthView({
  selectedDate,
  direction,
  variants,
  setSelectedDate,
  setMode,
  setDirection,
}: {
  selectedDate: Date;
  direction: number;
  variants: any;
  setSelectedDate: (date: Date) => void;
  setMode: (mode: "calendar" | "planner") => void;
  setDirection: (direction: number) => void;
}) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const { activeNestling } = useNestlingTreeStore();
  if (!activeNestling) return null;

  const years = Array.from({ length: 50 }, (_, i) => 2000 + i); // 2000–2049

  const goToNextMonth = () => {
    setDirection(1);
    setCurrentDate(addMonths(currentDate, 1));
  };

  const goToPreviousMonth = () => {
    setDirection(-1);
    setCurrentDate(subMonths(currentDate, 1));
  };

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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

      <div className="mt-6 mb-2 grid grid-cols-7 text-center text-sm font-medium text-gray-500 dark:text-gray-300">
        {weekDays.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="relative min-h-[500px] overflow-hidden">
        <MonthGrid
          {...{
            currentDate,
            setCurrentDate,
            selectedDate,
            setSelectedDate,
            setMode,
            direction,
            setDirection,
            variants,
          }}
        />
      </div>
    </motion.div>
  );
}
