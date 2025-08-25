import { create } from "zustand";
import type { PlannerEventType, NewPlannerEventType } from "@/lib/types";
import {
  createPlannerEvent,
  deletePlannerEvent,
  getPlannerEvents,
  updatePlannerEvent,
} from "@/lib/nestlings";

interface PlannerState {
  events: PlannerEventType[];
  loading: boolean;
  error: string | null;

  addEvent: (event: NewPlannerEventType) => Promise<void>;
  fetchEvents: ({
    nestlingId,
    weekStart,
    weekEnd,
  }: {
    nestlingId: number;
    weekStart: string;
    weekEnd: string;
  }) => Promise<void>;
  updateEvent: ({
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
  }) => Promise<void>;
  deleteEvent: (id: number) => Promise<void>;
}

export const usePlannerStore = create<PlannerState>((set, get) => ({
  events: [],
  loading: false,
  error: null,

  fetchEvents: async ({
    nestlingId,
    weekStart,
    weekEnd,
  }: {
    nestlingId: number;
    weekStart: string;
    weekEnd: string;
  }) => {
    set({ loading: true, error: null });
    try {
      const events = await getPlannerEvents({
        id: nestlingId,
        weekStart,
        weekEnd,
      });
      set({ events, loading: false });
    } catch (e) {
      set({ error: String(e), loading: false });
    }
  },

  addEvent: async (newEvent: NewPlannerEventType) => {
    try {
      const event = await createPlannerEvent(newEvent);
      set({ events: [...get().events, event] });
    } catch (e) {
      set({ error: String(e) });
    }
  },

  updateEvent: async ({
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
  }) => {
    try {
      await updatePlannerEvent({
        id,
        date,
        title,
        description,
        start_time,
        duration,
        color,
      });

      // Update state manually
      set({
        events: get().events.map((e) =>
          e.id === id
            ? {
                ...e,
                date,
                title,
                description: description ?? e.description,
                start_time,
                duration,
                updated_at: new Date().toISOString(),
                color: color ?? e.color, // keep old color if null
              }
            : e,
        ),
      });
    } catch (e) {
      set({ error: String(e) });
    }
  },

  deleteEvent: async (id) => {
    try {
      await deletePlannerEvent(id);
      set({ events: get().events.filter((e) => e.id !== id) });
    } catch (e) {
      set({ error: String(e) });
    }
  },
}));
