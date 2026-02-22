import { useEffect, useMemo, useState } from "react";
import PlannerView from "./PlannerView";
import NestlingTitle from "../NestlingTitle";
import useAutoSave from "@/hooks/useAutoSave";
import {
  useActiveNestling,
  useNestlingActions,
} from "@/stores/useNestlingStore";
import { addDaysToDate, getWeekRange } from "@/lib/utils/date";
import { useEvents, usePlannerActions } from "@/stores/usePlannerStore";
import FloatingCalendar from "./FloatingCalendar";
import { CalendarPlus } from "lucide-react";
import { toast } from "@/lib/utils/toast.tsx";

export default function CalendarEditor() {
  const activeNestling = useActiveNestling();
  if (!activeNestling) return;

  const [title, setTitle] = useState(activeNestling.title);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { getEvents, createEvent } = usePlannerActions();
  const events = useEvents();
  const { updateNestling } = useNestlingActions();

  const nestlingData = useMemo(() => ({ title }), [title]);
  useAutoSave(activeNestling.id!, nestlingData, updateNestling);

  const { start, end } = useMemo(
    () => getWeekRange(selectedDate),
    [selectedDate],
  );

  const duplicateWeek = () => {
    try {
      if (events.length === 0) {
        toast.error("No events to duplicate for this week.");
        return;
      }

      events.forEach(async (event) => {
        const newEvent = {
          ...event,
          date: addDaysToDate(event.date, 7),
        };

        await createEvent(newEvent);
      });

      toast.success("Week duplicated successfully!");
    } catch (error) {
      console.error("Error duplicating week:", error);
      toast.error("Error duplicating week:");
    }
  };

  useEffect(() => {
    getEvents({
      nestlingId: activeNestling.id,
      start,
      end,
    });
  }, [activeNestling.id, start, end]);

  return (
    <div className="relative">
      <div className="flex w-full flex-row items-center justify-between">
        <NestlingTitle
          title={title}
          setTitle={setTitle}
          nestling={activeNestling}
        />

        <div className="flex items-center gap-2">
          <button
            onClick={duplicateWeek}
            className="flex items-center gap-1.5 rounded-lg bg-teal-500 px-3 py-1.5 text-sm text-white shadow transition hover:bg-teal-600"
          >
            <CalendarPlus className="h-4 w-4" />
            Duplicate Week
          </button>
        </div>
      </div>

      <PlannerView selectedDate={selectedDate} />

      <FloatingCalendar
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
      />
    </div>
  );
}
