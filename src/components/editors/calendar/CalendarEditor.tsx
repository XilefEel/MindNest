import { useState } from "react";
import { AnimatePresence } from "framer-motion";

import MonthView from "./MonthView";
import PlannerView from "./PlannerView";
import NestlingTitle from "../NestlingTitle";
import { useNestlingTreeStore } from "@/stores/useNestlingStore";
import useAutoSave from "@/hooks/useAutoSave";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CalendarEditor() {
  const { activeNestling } = useNestlingTreeStore();
  if (!activeNestling) return null;
  const [title, setTitle] = useState(activeNestling.title);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [direction, setDirection] = useState(1);
  const [mode, setMode] = useState<"calendar" | "planner">("calendar");

  const { refreshData, updateNestling } = useNestlingTreeStore();

  useAutoSave({
    nestling: activeNestling,
    title,
    content: "",
    updateNestling,
    refreshData,
  });

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
      <div className="flex">
        <div
          className={cn("flex items-center", mode === "calendar" && "hidden")}
        >
          <Button
            variant="ghost"
            onClick={() => {
              setMode("calendar");
              setDirection(1);
            }}
          >
            <ArrowLeft />
          </Button>
        </div>
        <NestlingTitle title={title} setTitle={setTitle} />
      </div>

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
          />
        )}
      </AnimatePresence>
    </div>
  );
}
