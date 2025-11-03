import { create } from "zustand";
import type {
  PlannerEventType,
  NewPlannerEventType,
} from "@/lib/types/calendar";
import * as calendarApi from "@/lib/api/calendar";
import { mergeWithCurrent, withStoreErrorHandler } from "@/lib/utils/general";

type PlannerState = {
  events: PlannerEventType[];
  loading: boolean;
  error: string | null;

  createEvent: (event: NewPlannerEventType) => Promise<void>;
  getEvents: ({
    nestlingId,
    start,
    end,
  }: {
    nestlingId: number;
    start: string;
    end: string;
  }) => Promise<void>;
  updateEvent: (
    id: number,
    updates: Partial<PlannerEventType>,
  ) => Promise<void>;
  deleteEvent: (id: number) => Promise<void>;
};

export const usePlannerStore = create<PlannerState>((set, get) => ({
  events: [],
  loading: false,
  error: null,

  getEvents: withStoreErrorHandler(
    set,
    async ({
      nestlingId,
      start,
      end,
    }: {
      nestlingId: number;
      start: string;
      end: string;
    }) => {
      const events = await calendarApi.getPlannerEvents({
        id: nestlingId,
        start,
        end,
      });
      set({ events });
    },
  ),

  createEvent: withStoreErrorHandler(
    set,
    async (newEvent: NewPlannerEventType) => {
      const event = await calendarApi.createPlannerEvent(newEvent);
      set({ events: [...get().events, event] });
    },
  ),

  // not using withStoreErrorHandler since we want optimistic update
  updateEvent: async (id, updates) => {
    const prevEvent = get().events;
    const current = prevEvent.find((e) => e.id === id);
    if (!current) throw new Error("Event not found");

    const updated = mergeWithCurrent(current, updates);

    try {
      set({ events: prevEvent.map((e) => (e.id === id ? updated : e)) });
      await calendarApi.updatePlannerEvent({ ...updated, id });
    } catch (error) {
      set({ events: prevEvent, error: String(error) });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteEvent: withStoreErrorHandler(set, async (id) => {
    await calendarApi.deletePlannerEvent(id);
    set({ events: get().events.filter((e) => e.id !== id) });
  }),
}));
