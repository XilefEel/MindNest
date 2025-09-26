import { invoke } from "@tauri-apps/api/core";
import { NewPlannerEventType, PlannerEventType } from "../types/calendar";

export async function createPlannerEvent(data: NewPlannerEventType) {
  return await invoke<PlannerEventType>("create_event", { data });
}

export async function getPlannerEvents({
  id,
  start,
  end,
}: {
  id: number;
  start: string;
  end: string;
}) {
  return await invoke<PlannerEventType[]>("get_events", {
    nestlingId: id,
    start,
    end,
  });
}

export async function updatePlannerEvent({
  id,
  date,
  title,
  description,
  start_time,
  duration,
  color,
}: {
  id: number;
  date: string;
  title: string;
  description: string | null;
  start_time: number;
  duration: number;
  color: string | null;
}) {
  return await invoke<void>("update_event", {
    id,
    date,
    title,
    description,
    startTime: start_time,
    duration,
    color,
  });
}

export async function deletePlannerEvent(id: number) {
  return await invoke<void>("delete_event", { id });
}
