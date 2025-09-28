import { create } from "zustand";
import { Nest } from "../lib/types/nests";
import {
  getUserNests,
  createNest,
  updateNest,
  deleteNest,
  getNestFromId,
} from "../lib/api/nests";
import {
  importBackground,
  deleteBackground,
  getBackgrounds,
  setBackground,
} from "@/lib/api/nest-background";
import { BackgroundImage } from "@/lib/types/nest_backgrounds";
import { open } from "@tauri-apps/plugin-dialog";

type NestState = {
  nests: Nest[];
  backgrounds: BackgroundImage[];
  activeNestId: number | null;
  loading: boolean;
  error: string | null;

  setActiveNestId: (nest: number | null) => void;
  fetchNests: (userId: number) => Promise<void>;
  createNest: (userId: number, title: string) => Promise<void>;
  updateNest: (nestId: number, newTitle: string) => Promise<void>;
  deleteNest: (nestId: number) => Promise<void>;
  refreshNest: () => Promise<void>;

  selectBackground: (nestId: number) => void;
  uploadBackground: (nestId: number, filePath: string) => Promise<void>;
  fetchBackgrounds: (nestId: number) => Promise<void>;
  setSelectedBackground: (
    nestId: number,
    backgroundId: number,
  ) => Promise<void>;
  deleteBackground: (id: number) => Promise<void>;
};

export const useNestStore = create<NestState>((set, get) => ({
  nests: [],
  backgrounds: [],
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

  uploadBackground: async (nestId: number, filePath: string) => {
    set({ loading: true, error: null });
    try {
      const background = await importBackground(nestId, filePath);
      return background;
    } catch (err) {
      set({ error: String(err) });
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  selectBackground: async (nestId: number) => {
    try {
      const selected = await open({
        multiple: true,
        filters: [
          {
            name: "Image",
            extensions: ["png", "jpeg", "jpg", "gif", "webp", "bmp"],
          },
        ],
      });

      if (!selected) return false;

      const files = Array.isArray(selected) ? selected : [selected];

      for (const filePath of files) {
        await get().uploadBackground(nestId, filePath);
      }
      await get().fetchBackgrounds(nestId);

      return true;
    } catch (error) {
      console.error("Failed to select files:", error);
      set({ error: String(error) });
      return false;
    }
  },

  fetchBackgrounds: async (nestId: number) => {
    set({ loading: true, error: null });
    try {
      const backgrounds = await getBackgrounds(nestId);
      set({ backgrounds });
    } catch (err) {
      set({ error: String(err) });
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  setSelectedBackground: async (nestId: number, backgroundId: number) => {
    set({ loading: true, error: null });
    try {
      await setBackground(nestId, backgroundId);
    } catch (err) {
      set({ error: String(err) });
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  deleteBackground: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await deleteBackground(id);
    } catch (err) {
      set({ error: String(err) });
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },
}));
