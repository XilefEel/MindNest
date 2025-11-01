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
  startTime,
  duration,
  color,
}: {
  id: number;
  date: string;
  title: string;
  description: string | null;
  startTime: number;
  duration: number;
  color: string | null;
}) {
  await invoke<void>("update_event", {
    id,
    date,
    title,
    description,
    startTime,
    duration,
    color,
  });
}

export async function deletePlannerEvent(id: number) {
  await invoke<void>("delete_event", { id });
}
