import { create } from "zustand";
import type {
  PlannerEventType,
  NewPlannerEventType,
} from "@/lib/types/calendar";
import * as calendarApi from "@/lib/api/calendar";
import { mergeWithCurrent, withStoreErrorHandler } from "@/lib/utils/general";
import { useNestlingStore } from "./useNestlingStore";

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
      set((state) => ({
        events: [...state.events, event],
      }));
      useNestlingStore.getState().updateNestlingTimestamp(event.nestlingId);
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

    useNestlingStore.getState().updateNestlingTimestamp(updated.nestlingId);
  },

  deleteEvent: withStoreErrorHandler(set, async (id) => {
    const event = get().events.find((e) => e.id === id);
    const nestlingId = event?.nestlingId;

    await calendarApi.deletePlannerEvent(id);

    set((state) => ({
      events: state.events.filter((e) => e.id !== id),
    }));

    if (nestlingId) {
      useNestlingStore.getState().updateNestlingTimestamp(nestlingId);
    }
  }),
}));
