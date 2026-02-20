import { useEffect, useMemo, useState } from "react";
import PlannerView from "./PlannerView";
import NestlingTitle from "../NestlingTitle";
import useAutoSave from "@/hooks/useAutoSave";
import {
  useActiveNestling,
  useNestlingActions,
} from "@/stores/useNestlingStore";
import { getWeekRange } from "@/lib/utils/date";
import { usePlannerActions } from "@/stores/usePlannerStore";
import FloatingCalendar from "./FloatingCalendar";

export default function CalendarEditor() {
  const activeNestling = useActiveNestling();
  if (!activeNestling) return;

  const [title, setTitle] = useState(activeNestling.title);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { getEvents } = usePlannerActions();
  const { updateNestling } = useNestlingActions();

  const nestlingData = useMemo(() => ({ title }), [title]);
  useAutoSave(activeNestling.id!, nestlingData, updateNestling);

  const { start, end } = useMemo(
    () => getWeekRange(selectedDate),
    [selectedDate],
  );

  useEffect(() => {
    getEvents({
      nestlingId: activeNestling.id,
      start,
      end,
    });
  }, [activeNestling.id, start, end]);

  return (
    <div className="relative mx-auto">
      <NestlingTitle
        title={title}
        setTitle={setTitle}
        nestling={activeNestling}
      />

      <PlannerView selectedDate={selectedDate} />

      <FloatingCalendar
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
      />
    </div>
  );
}
