import { useState } from "react";
import { AnimatePresence } from "framer-motion";

import MonthView from "./MonthView";
import PlannerView from "./PlannerView";

export default function CalendarEditor() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [direction, setDirection] = useState(1);
  const [mode, setMode] = useState<"calendar" | "planner">("calendar");

  const viewVariants = {
    monthEnter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    monthCenter: { x: 0, opacity: 1 },
    monthExit: (direction: number) => ({
      x: direction > 0 ? "-100%" : "100%",
      opacity: 0,
    }),

    plannerEnter: { x: "150%" },
    plannerCenter: { x: 0 },
    plannerExit: { x: "150%" },

    calendarEnter: { x: "-150%" },
    calendarCenter: { x: 0 },
    calendarExit: { x: "-150%" },
  };

  return (
    <div className="relative mx-auto p-4">
      <AnimatePresence mode="sync" initial={false} custom={direction}>
        {mode === "calendar" ? (
          <MonthView
            key="month"
            currentDate={currentDate}
            selectedDate={selectedDate}
            direction={direction}
            variants={viewVariants}
            setCurrentDate={setCurrentDate}
            setSelectedDate={setSelectedDate}
            setMode={setMode}
            setDirection={setDirection}
          />
        ) : (
          <PlannerView
            key="planner"
            selectedDate={selectedDate}
            variants={viewVariants}
            setMode={setMode}
            setDirection={setDirection}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
