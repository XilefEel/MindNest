import { create } from "zustand";
import { open } from "@tauri-apps/plugin-dialog";
import { withStoreErrorHandler } from "@/lib/utils/general";
import { useShallow } from "zustand/react/shallow";
import * as nestApi from "../lib/api/nest";
import * as backgroundApi from "@/lib/api/background-image";
import * as musicApi from "@/lib/api/background-music";
import { Nest } from "../lib/types/nest";
import { BackgroundImage } from "@/lib/types/background-image";
import { BackgroundMusic } from "@/lib/types/background-music";
import {
  saveLastBackgroundImage,
  clearLastBackgroundImage,
} from "@/lib/storage/background-image";
import {
  saveLastBackgroundMusic,
  clearLastBackgroundMusic,
} from "@/lib/storage/background-music";

type NestState = {
  nests: Nest[];
  backgrounds: BackgroundImage[];
  music: BackgroundMusic[];

  activeNestId: number | null;
  activeBackgroundId: number | null;
  activeMusicId: number | null;

  loading: boolean;
  error: string | null;

  // Nest
  setActiveNestId: (nest: number | null) => void;
  getNests: (userId: number) => Promise<void>;
  createNest: (userId: number, title: string) => Promise<void>;
  updateNest: (nestId: number, newTitle: string) => Promise<void>;
  deleteNest: (nestId: number) => Promise<void>;
  refreshNest: () => Promise<void>;

  // Background Images
  setActiveBackgroundId: (backgroundId: number | null) => Promise<void>;
  clearActiveBackgroundId: () => void;
  selectBackground: (nestId: number) => Promise<boolean>;
  getBackgrounds: (nestId: number) => Promise<void>;
  deleteBackground: (id: number) => Promise<void>;

  // Background Music
  setActiveMusicId: (musicId: number | null) => Promise<void>;
  clearActiveMusicId: () => void;
  selectMusic: (nestId: number) => Promise<boolean>;
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
      const newBackground = await backgroundApi.importBackground(
        nestId,
        filePath,
      );
      get().setActiveBackgroundId(newBackground.id);
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

  setActiveMusicId: async (musicId) => {
    if (musicId) {
      await saveLastBackgroundMusic(get().activeNestId!, musicId);
      set({ activeMusicId: musicId });
    } else {
      await clearLastBackgroundMusic(get().activeNestId!);
      set({ activeMusicId: null });
    }
  },

  clearActiveMusicId: async () => {
    await clearLastBackgroundMusic(get().activeNestId!);
    set({ activeMusicId: null });
  },

  selectMusic: withStoreErrorHandler(set, async (nestId: number) => {
    const selected = await open({
      multiple: true,
      filters: [{ name: "Audio", extensions: ["mp3", "ogg", "wav", "m4a"] }],
    });

    if (!selected) return false;

    const files = Array.isArray(selected) ? selected : [selected];

    for (const filePath of files) {
      const newMusic = await musicApi.importMusic(nestId, filePath, 0);
      if (newMusic) {
        set((state) => ({
          music: [newMusic, ...state.music],
        }));
      }
    }
    return true;
  }),

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
      getNests: state.getNests,
      createNest: state.createNest,
      updateNest: state.updateNest,
      deleteNest: state.deleteNest,
      refreshNest: state.refreshNest,

      setActiveBackgroundId: state.setActiveBackgroundId,
      clearActiveBackgroundId: state.clearActiveBackgroundId,
      selectBackground: state.selectBackground,
      getBackgrounds: state.getBackgrounds,
      deleteBackground: state.deleteBackground,

      setActiveMusicId: state.setActiveMusicId,
      clearActiveMusicId: state.clearActiveMusicId,
      selectMusic: state.selectMusic,
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
