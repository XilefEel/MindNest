import { create } from "zustand";
import { Nest } from "../lib/types/nests";
import {
  getUserNests,
  createNest,
  updateNest,
  deleteNest,
  getNestFromId,
} from "../lib/api/nests";

type NestState = {
  nests: Nest[];
  activeNestId: number | null;
  loading: boolean;
  error: string | null;

  setActiveNestId: (nest: number | null) => void;
  fetchNests: (userId: number) => Promise<void>;
  createNest: (userId: number, title: string) => Promise<void>;
  updateNest: (nestId: number, newTitle: string) => Promise<void>;
  deleteNest: (nestId: number) => Promise<void>;
  refreshNest: () => Promise<void>;
};

export const useNestStore = create<NestState>((set, get) => ({
  nests: [],
  activeNestId: null,
  error: null,
  loading: false,

  setActiveNestId: (nestId) => set({ activeNestId: nestId }),

  fetchNests: async (userId) => {
    set({ loading: true, error: null });
    try {
      const nests = await getUserNests(userId);
      set({ nests: nests });
    } catch (err) {
      set({ error: String(err) });
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  createNest: async (userId, title) => {
    set({ loading: true, error: null });
    try {
      await createNest(userId, title);
      await get().fetchNests(userId);
    } catch (err) {
      set({ error: String(err) });
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  updateNest: async (nestId, newTitle) => {
    set({ loading: true, error: null });
    try {
      await updateNest(nestId, newTitle);

      const updatedNests = get().nests.map((n) =>
        n.id === nestId ? { ...n, title: newTitle } : n,
      );

      set({ nests: updatedNests });
    } catch (err) {
      set({ error: String(err) });
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  deleteNest: async (nestId) => {
    set({ loading: true, error: null });
    try {
      await deleteNest(nestId);
      set((state) => ({
        nests: state.nests.filter((n) => n.id !== nestId),
      }));
      if (get().activeNestId === nestId) set({ activeNestId: null });
    } catch (err) {
      set({ error: String(err) });
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  refreshNest: async () => {
    set({ loading: true, error: null });
    try {
      const activeId = get().activeNestId;
      if (!activeId) return;

      const updatedNest = await getNestFromId(activeId);

      set((state) => ({
        nests: state.nests.map((n) => (n.id === activeId ? updatedNest : n)),
      }));
    } catch (err) {
      set({ error: String(err) });
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },
}));
