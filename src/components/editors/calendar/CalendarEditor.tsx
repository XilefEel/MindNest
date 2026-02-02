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

export default function CalendarEditor() {
  const activeNestling = useActiveNestling();
  if (!activeNestling) return;

  const [title, setTitle] = useState(activeNestling.title);

  const { getEvents } = usePlannerActions();
  const { updateNestling } = useNestlingActions();

  const nestlingData = useMemo(() => ({ title }), [title]);
  useAutoSave(activeNestling.id!, nestlingData, updateNestling);
  const { start, end } = getWeekRange(new Date());

  useEffect(() => {
    getEvents({
      nestlingId: activeNestling.id,
      start,
      end,
    });
  }, [activeNestling.id]);

  return (
    <div className="relative mx-auto p-4">
      <div className="flex">
        <NestlingTitle
          title={title}
          setTitle={setTitle}
          nestling={activeNestling}
        />
      </div>

      <PlannerView />
    </div>
  );
}
