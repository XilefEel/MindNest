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
  saveStoredBackgroundImage,
  saveLastBackgroundImageBrightness,
  clearStoredBackgroundImage,
} from "@/lib/storage/background-image";
import {
  saveLastBackgroundMusic,
  clearLastBackgroundMusic,
  saveLastMusicVolume,
} from "@/lib/storage/background-music";

type NestState = {
  nests: Nest[];
  backgrounds: BackgroundImage[];
  music: BackgroundMusic[];

  activeNestId: number | null;

  activeBackgroundId: number | null;
  storedBackgroundId: number | null;
  backgroundBrightness: number;

  activeMusicId: number | null;
  audioCurrentTime: number;
  audioIsPlaying: boolean;
  audioIsPaused: boolean;
  musicVolume: number;

  loading: boolean;

  // Nest
  setActiveNestId: (nest: number | null) => void;
  getNests: (userId: number) => Promise<void>;
  createNest: (userId: number, title: string) => Promise<void>;
  updateNest: (nestId: number, newTitle: string) => Promise<void>;
  deleteNest: (nestId: number) => Promise<void>;
  refreshNest: () => Promise<void>;

  // Background Images
  setActiveBackgroundId: (backgroundId: number | null) => Promise<void>;
  setStoredBackgroundId: (backgroundId: number | null) => void;
  clearActiveBackgroundId: () => void;
  clearStoredBackgroundId: () => void;

  selectBackground: (nestId: number) => Promise<boolean>;
  getBackgrounds: (nestId: number) => Promise<void>;
  deleteBackground: (id: number) => Promise<void>;
  setBackgroundBrightness: (brightness: number) => void;

  // Background Music
  setAudioCurrentTime: (time: number) => void;
  setAudioIsPlaying: (playing: boolean) => void;
  setAudioIsPaused: (paused: boolean) => void;
  setMusicVolume: (volume: number) => void;

  setActiveMusicId: (musicId: number | null) => Promise<void>;
  clearActiveMusicId: () => void;
  selectMusic: (nestId: number) => Promise<boolean>;
  getMusic: (nestId: number) => Promise<void>;
  updateMusic: (id: number, title: string) => Promise<void>;
  deleteMusic: (id: number) => Promise<void>;
};

export const useNestStore = create<NestState>((set, get) => ({
  nests: [],
  backgrounds: [],
  music: [],

  activeNestId: null,

  activeBackgroundId: null,
  storedBackgroundId: null,
  backgroundBrightness: 1,

  activeMusicId: null,
  audioCurrentTime: 0,
  audioIsPlaying: false,
  audioIsPaused: false,
  musicVolume: 0.5,

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
    await saveLastBackgroundImage(get().activeNestId!, backgroundId!);
    await saveStoredBackgroundImage(get().activeNestId!, backgroundId!);

    set({ activeBackgroundId: backgroundId });

    if (backgroundId) {
      get().setStoredBackgroundId(backgroundId);
    }
  },

  setStoredBackgroundId: (backgroundId) => {
    set({ storedBackgroundId: backgroundId });
  },

  clearActiveBackgroundId: async () => {
    await clearLastBackgroundImage(get().activeNestId!);
    set({ activeBackgroundId: null });
  },

  clearStoredBackgroundId: async () => {
    await clearStoredBackgroundImage(get().activeNestId!);
    set({ storedBackgroundId: null });
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

    const newBackgrounds = await Promise.all(
      files.map((filePath) => backgroundApi.importBackground(nestId, filePath)),
    );

    set((state) => ({
      backgrounds: [...newBackgrounds, ...state.backgrounds],
    }));

    await get().setActiveBackgroundId(newBackgrounds[0].id);

    return true;
  }),

  getBackgrounds: withStoreErrorHandler(set, async (nestId: number) => {
    const backgrounds = await backgroundApi.getBackgrounds(nestId);
    set({ backgrounds });
  }),

  deleteBackground: withStoreErrorHandler(set, async (backgroundId: number) => {
    await backgroundApi.removeBackground(backgroundId);

    if (backgroundId === get().activeBackgroundId) {
      get().clearActiveBackgroundId();
    }

    if (backgroundId === get().storedBackgroundId) {
      get().clearStoredBackgroundId();
    }

    set((state) => ({
      backgrounds: state.backgrounds.filter((b) => b.id !== backgroundId),
      ...(state.activeBackgroundId === backgroundId && {
        activeBackgroundId: null,
      }),
    }));
  }),

  setBackgroundBrightness: (brightness: number) => {
    set({ backgroundBrightness: brightness });
    saveLastBackgroundImageBrightness(get().activeNestId!, brightness);
  },

  setAudioCurrentTime: (time: number) => set({ audioCurrentTime: time }),

  setAudioIsPlaying: (playing: boolean) => set({ audioIsPlaying: playing }),

  setAudioIsPaused: (paused: boolean) => set({ audioIsPaused: paused }),

  setMusicVolume: (volume: number) => {
    saveLastMusicVolume(get().activeNestId!, volume);
    set({ musicVolume: volume });
  },

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

    const newTracks = await Promise.all(
        files.map((filePath) => musicApi.importMusic(nestId, filePath),
      ),
    );

    set((state) => ({
      music: [...state.music, ...newTracks.filter(Boolean)],
    }));

    return true;
  }),

  getMusic: withStoreErrorHandler(set, async (nestId: number) => {
    const music = await musicApi.getMusic(nestId);
    set({ music });
  }),

  updateMusic: withStoreErrorHandler(
    set,
    async (id: number, title: string) => {
      set((state) => ({
        music: state.music.map((m) =>
          m.id === id ? { ...m, title } : m,
        ),
      }));

      await musicApi.updateMusic(id, title);
    },
  ),

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
      setStoredBackgroundId: state.setStoredBackgroundId,
      clearActiveBackgroundId: state.clearActiveBackgroundId,

      selectBackground: state.selectBackground,
      getBackgrounds: state.getBackgrounds,
      deleteBackground: state.deleteBackground,
      setBackgroundBrightness: state.setBackgroundBrightness,

      setAudioCurrentTime: state.setAudioCurrentTime,
      setAudioIsPlaying: state.setAudioIsPlaying,
      setAudioIsPaused: state.setAudioIsPaused,
      setMusicVolume: state.setMusicVolume,

      setActiveMusicId: state.setActiveMusicId,
      clearActiveMusicId: state.clearActiveMusicId,
      selectMusic: state.selectMusic,
      getMusic: state.getMusic,
      updateMusic: state.updateMusic,
      deleteMusic: state.deleteMusic,
    })),
  );

export const useNests = () => useNestStore((state) => state.nests);

export const useActiveNestId = () =>
  useNestStore((state) => state.activeNestId);

export const useBackgrounds = () => useNestStore((state) => state.backgrounds);

export const useActiveBackgroundId = () =>
  useNestStore((state) => state.activeBackgroundId);

export const useStoredBackgroundId = () =>
  useNestStore((state) => state.storedBackgroundId);

export const useBackgroundBrightness = () =>
  useNestStore((state) => state.backgroundBrightness);

export const useMusic = () => useNestStore((state) => state.music);

export const useActiveMusicId = () =>
  useNestStore((state) => state.activeMusicId);

export const useAudioIsPaused = () =>
  useNestStore((state) => state.audioIsPaused);

export const useAudioCurrentTime = () =>
  useNestStore((state) => state.audioCurrentTime);

export const useMusicVolume = () => useNestStore((state) => state.musicVolume);
