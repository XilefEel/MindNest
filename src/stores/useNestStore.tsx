import { create } from "zustand";
import { Nest } from "../lib/types/nest";
import * as nestApi from "../lib/api/nest";
import * as backgroundApi from "@/lib/api/nest-background";
import { BackgroundImage } from "@/lib/types/nest_backgrounds";
import { open } from "@tauri-apps/plugin-dialog";
import {
  saveLastBackgroundImage,
  clearLastBackgroundImage,
} from "@/lib/storage/session";
import { withStoreErrorHandler } from "@/lib/utils/general";

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

  fetchNests: withStoreErrorHandler(set, async (userId) => {
    const nests = await nestApi.getUserNests(userId);
    set({ nests: nests });
  }),

  createNest: withStoreErrorHandler(set, async (userId, title) => {
    await nestApi.createNest(userId, title);
    await get().fetchNests(userId);
  }),

  updateNest: withStoreErrorHandler(set, async (nestId, newTitle) => {
    set((state) => ({
      nests: state.nests.map((n) =>
        n.id === nestId ? { ...n, title: newTitle } : n,
      ),
    }));

    await nestApi.updateNest(nestId, newTitle);
  }),

  deleteNest: withStoreErrorHandler(set, async (nestId) => {
    await nestApi.deleteNest(nestId);
    set((state) => ({
      nests: state.nests.filter((n) => n.id !== nestId),
    }));

    if (get().activeNestId === nestId) set({ activeNestId: null });
  }),

  refreshNest: withStoreErrorHandler(set, async () => {
    const activeId = get().activeNestId;
    if (!activeId) return;

    const updatedNest = await nestApi.getNestFromId(activeId);

    set((state) => ({
      nests: state.nests.map((n) => (n.id === activeId ? updatedNest : n)),
    }));
  }),

  uploadBackground: withStoreErrorHandler(
    set,
    async (nestId: number, filePath: string) => {
      const background = await backgroundApi.importBackground(nestId, filePath);
      get().setActiveBackgroundId(background.id);
      return background;
    },
  ),

  selectBackground: withStoreErrorHandler(set, async (nestId: number) => {
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
  }),

  fetchBackgrounds: withStoreErrorHandler(set, async (nestId: number) => {
    const backgrounds = await backgroundApi.getBackgrounds(nestId);
    set({ backgrounds });
  }),

  deleteBackground: withStoreErrorHandler(set, async (backgroundId: number) => {
    const activeNestId = get().activeNestId;
    await Promise.all([
      backgroundApi.deleteBackground(backgroundId),
      clearLastBackgroundImage(activeNestId!),
    ]);
    set((state) => ({
      backgrounds: state.backgrounds.filter((b) => b.id !== backgroundId),
      activeBackgroundId: null,
    }));
  }),
}));
