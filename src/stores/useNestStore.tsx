import { create } from "zustand";
import { Nest } from "../lib/types/nest";
import {
  getUserNests,
  createNest,
  updateNest,
  deleteNest,
  getNestFromId,
} from "../lib/api/nest";
import {
  importBackground,
  deleteBackground,
  getBackgrounds,
} from "@/lib/api/nest-background";
import { BackgroundImage } from "@/lib/types/nest_backgrounds";
import { open } from "@tauri-apps/plugin-dialog";
import {
  saveLastBackgroundImage,
  clearLastBackgroundImage,
} from "@/lib/storage/session";

type NestState = {
  nests: Nest[];
  backgrounds: BackgroundImage[];
  activeNestId: number | null;
  activeBackgroundId: number | null;
  loading: boolean;
  error: string | null;

  setActiveNestId: (nest: number | null) => void;
  setActiveBackgroundId: (backgroundId: number | null) => Promise<void>;
  clearActiveBackgroundId: () => void;

  fetchNests: (userId: number) => Promise<void>;
  createNest: (userId: number, title: string) => Promise<void>;
  updateNest: (nestId: number, newTitle: string) => Promise<void>;
  deleteNest: (nestId: number) => Promise<void>;
  refreshNest: () => Promise<void>;

  selectBackground: (nestId: number) => Promise<boolean>;
  uploadBackground: (
    nestId: number,
    filePath: string,
  ) => Promise<BackgroundImage>;
  fetchBackgrounds: (nestId: number) => Promise<void>;
  deleteBackground: (id: number) => Promise<void>;
};

export const useNestStore = create<NestState>((set, get) => ({
  nests: [],
  backgrounds: [],
  activeNestId: null,
  activeBackgroundId: null,
  error: null,
  loading: false,

  setActiveNestId: (nestId) => {
    set({ activeNestId: nestId });
  },

  setActiveBackgroundId: async (backgroundId) => {
    if (backgroundId) {
      await saveLastBackgroundImage(get().activeNestId!, backgroundId);
      set({ activeBackgroundId: backgroundId });
    } else {
      set({ activeBackgroundId: null });
    }
  },

  clearActiveBackgroundId: async () => {
    await clearLastBackgroundImage(get().activeNestId!);
    set({ activeBackgroundId: null });
  },

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
      set((state) => ({
        nests: state.nests.map((n) =>
          n.id === nestId ? { ...n, title: newTitle } : n,
        ),
      }));

      await updateNest(nestId, newTitle);
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
      get().setActiveBackgroundId(background.id);
      return background;
    } catch (err) {
      set({ error: String(err) });
      console.error(err);
      throw err;
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
        const newBackground = await get().uploadBackground(nestId, filePath);
        if (newBackground) {
          set((state) => ({
            backgrounds: [newBackground, ...state.backgrounds],
          }));
        }
      }

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

  deleteBackground: async (backgroundId: number) => {
    set({ loading: true, error: null });
    try {
      const activeNestId = get().activeNestId;

      await Promise.all([
        deleteBackground(backgroundId),
        clearLastBackgroundImage(activeNestId!),
      ]);
      set((state) => ({
        backgrounds: state.backgrounds.filter((b) => b.id !== backgroundId),
        activeBackgroundId: null,
      }));
    } catch (err) {
      set({ error: String(err) });
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },
}));
