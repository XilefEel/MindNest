import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";

import MonthView from "./MonthView";
import PlannerView from "./PlannerView";
import NestlingTitle from "../NestlingTitle";
import { useNestlingStore } from "@/stores/useNestlingStore";
import useAutoSave from "@/hooks/useAutoSave";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils/general";
import { editNote } from "@/lib/api/note";

export default function CalendarEditor() {
  const { activeNestling } = useNestlingStore();
  if (!activeNestling) return null;
  const [title, setTitle] = useState(activeNestling.title);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [direction, setDirection] = useState(1);
  const [mode, setMode] = useState<"calendar" | "planner">("calendar");

  useAutoSave({
    target: activeNestling,
    currentData: useMemo(() => ({ title }), [title]),
    saveFunction: (id, data) => editNote(id, data.title, ""),
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
            selectedDate={selectedDate}
            direction={direction}
            variants={viewVariants}
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
