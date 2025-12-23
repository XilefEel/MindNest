import { create } from "zustand";
import { Nest } from "../lib/types/nest";
import * as nestApi from "../lib/api/nest";
import * as backgroundApi from "@/lib/api/background-image";
import * as musicApi from "@/lib/api/background-music";
import { BackgroundImage } from "@/lib/types/background-image";
import { open } from "@tauri-apps/plugin-dialog";
import {
  saveLastBackgroundImage,
  clearLastBackgroundImage,
} from "@/lib/storage/session";
import { withStoreErrorHandler } from "@/lib/utils/general";
import { useShallow } from "zustand/react/shallow";
import { BackgroundMusic } from "@/lib/types/background-music";

type NestState = {
  nests: Nest[];
  backgrounds: BackgroundImage[];
  music: BackgroundMusic[];

  activeNestId: number | null;
  activeBackgroundId: number | null;
  activeMusicId: number | null;

  loading: boolean;
  error: string | null;

  setActiveNestId: (nest: number | null) => void;
  setActiveBackgroundId: (backgroundId: number | null) => Promise<void>;
  clearActiveBackgroundId: () => void;

  // Nest
  getNests: (userId: number) => Promise<void>;
  createNest: (userId: number, title: string) => Promise<void>;
  updateNest: (nestId: number, newTitle: string) => Promise<void>;
  deleteNest: (nestId: number) => Promise<void>;
  refreshNest: () => Promise<void>;

  // Background Images
  selectBackground: (nestId: number) => Promise<boolean>;
  uploadBackground: (
    nestId: number,
    filePath: string,
  ) => Promise<BackgroundImage>;
  getBackgrounds: (nestId: number) => Promise<void>;
  deleteBackground: (id: number) => Promise<void>;

  // Background Music
  selectMusic: (nestId: number) => Promise<boolean>;
  uploadMusic: (nestId: number, filePath: string) => Promise<BackgroundMusic>;
  getMusic: (nestId: number) => Promise<void>;
  deleteMusic: (id: number) => Promise<void>;
};

export const useNestStore = create<NestState>((set, get) => ({
  nests: [],
  backgrounds: [],
  music: [],

  activeNestId: null,
  activeBackgroundId: null,
  activeMusicId: null,

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

  getNests: withStoreErrorHandler(set, async (userId) => {
    const nests = await nestApi.getNests(userId);
    set({ nests });
  }),

  createNest: withStoreErrorHandler(set, async (userId, title) => {
    await nestApi.createNest(userId, title);
    await get().getNests(userId);
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

  getBackgrounds: withStoreErrorHandler(set, async (nestId: number) => {
    const backgrounds = await backgroundApi.getBackgrounds(nestId);
    set({ backgrounds });
  }),

  deleteBackground: withStoreErrorHandler(set, async (backgroundId: number) => {
    const activeNestId = get().activeNestId;
    await backgroundApi.removeBackground(backgroundId);

    if (backgroundId === get().activeBackgroundId) {
      await clearLastBackgroundImage(activeNestId!);
    }

    set((state) => ({
      backgrounds: state.backgrounds.filter((b) => b.id !== backgroundId),
      ...(state.activeBackgroundId === backgroundId && {
        activeBackgroundId: null,
      }),
    }));
  }),

  selectMusic: withStoreErrorHandler(set, async (nestId: number) => {
    const selected = await open({
      multiple: true,
      filters: [{ name: "Audio", extensions: ["mp3", "ogg", "wav", "m4a"] }],
    });

    if (!selected) return false;

    const files = Array.isArray(selected) ? selected : [selected];

    for (const filePath of files) {
      const newMusic = await get().uploadMusic(nestId, filePath);
      if (newMusic) {
        set((state) => ({
          music: [newMusic, ...state.music],
        }));
      }
    }
    return true;
  }),

  uploadMusic: withStoreErrorHandler(
    set,
    async (nestId: number, filePath: string) => {
      const music = await musicApi.importMusic(nestId, filePath, "", 0, 0);
      return music;
    },
  ),

  getMusic: withStoreErrorHandler(set, async (nestId: number) => {
    const music = await musicApi.getMusic(nestId);
    set({ music });
  }),

  deleteMusic: withStoreErrorHandler(set, async (musicId: number) => {
    await musicApi.deleteMusic(musicId);
    set((state) => ({
      music: state.music.filter((m) => m.id !== musicId),
    }));

    if (get().activeMusicId === musicId) set({ activeMusicId: null });
  }),
}));

export const useNestActions = () =>
  useNestStore(
    useShallow((state) => ({
      setActiveNestId: state.setActiveNestId,
      setActiveBackgroundId: state.setActiveBackgroundId,
      clearActiveBackgroundId: state.clearActiveBackgroundId,

      getNests: state.getNests,
      createNest: state.createNest,
      updateNest: state.updateNest,
      deleteNest: state.deleteNest,
      refreshNest: state.refreshNest,

      selectBackground: state.selectBackground,
      uploadBackground: state.uploadBackground,
      getBackgrounds: state.getBackgrounds,
      deleteBackground: state.deleteBackground,

      selectMusic: state.selectMusic,
      uploadMusic: state.uploadMusic,
      getMusic: state.getMusic,
      deleteMusic: state.deleteMusic,
    })),
  );

export const useNests = () => useNestStore((state) => state.nests);

export const useActiveNestId = () =>
  useNestStore((state) => state.activeNestId);

export const useActiveNest = () =>
  useNestStore((state) => {
    const { activeNestId, nests } = state;
    return nests.find((n) => n.id === activeNestId) ?? null;
  });

export const useBackgrounds = () => useNestStore((state) => state.backgrounds);

export const useActiveBackgroundId = () =>
  useNestStore((state) => state.activeBackgroundId);

export const useMusic = () => useNestStore((state) => state.music);

export const useActiveMusicId = () =>
  useNestStore((state) => state.activeMusicId);
