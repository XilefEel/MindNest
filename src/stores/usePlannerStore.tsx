import { create } from "zustand";
import type {
  PlannerEventType,
  NewPlannerEventType,
} from "@/lib/types/calendar";
import * as calendarApi from "@/lib/api/calendar";
import { withStoreErrorHandler } from "@/lib/utils/general";

type PlannerState = {
  events: PlannerEventType[];
  loading: boolean;
  error: string | null;

  addEvent: (event: NewPlannerEventType) => Promise<void>;
  fetchEvents: ({
    nestlingId,
    start,
    end,
  }: {
    nestlingId: number;
    start: string;
    end: string;
  }) => Promise<void>;
  updateEvent: ({
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
  }) => Promise<void>;
  deleteEvent: (id: number) => Promise<void>;
};

export const usePlannerStore = create<PlannerState>((set, get) => ({
  events: [],
  loading: false,
  error: null,

  fetchEvents: withStoreErrorHandler(
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

  addEvent: withStoreErrorHandler(
    set,
    async (newEvent: NewPlannerEventType) => {
      const event = await calendarApi.createPlannerEvent(newEvent);
      set({ events: [...get().events, event] });
    },
  ),

  // not using withStoreErrorHandler since we want optimistic update
  updateEvent: async ({
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
  }) => {
    const prevEvent = get().events;
    try {
      set({
        events: prevEvent.map((e) =>
          e.id === id
            ? {
                ...e,
                date,
                title,
                description: description ?? e.description,
                startTime,
                duration,
                updatedAt: new Date().toISOString(),
                color: color ?? e.color,
              }
            : e,
        ),
      });
      await calendarApi.updatePlannerEvent({
        id,
        date,
        title,
        description,
        startTime,
        duration,
        color,
      });
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
