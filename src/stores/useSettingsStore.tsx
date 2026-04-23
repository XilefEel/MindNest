import {
  DEFAULT_UI_SETTINGS,
  loadSettings,
  Settings,
  updateSetting,
} from "@/lib/storage/settings";
import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";

let debounceTimers: Partial<
  Record<keyof Settings, ReturnType<typeof setTimeout>>
> = {};

type SettingsState = Settings & {
  loaded: boolean;
  loadSettings: () => Promise<void>;
  setSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  resetSettings: () => void;
};

const useSettingsStore = create<SettingsState>((set) => ({
  ...DEFAULT_UI_SETTINGS,

  loaded: false,

  loadSettings: async () => {
    const settings = await loadSettings();
    set({ ...settings, loaded: true });
  },

  setSetting: (key, value) => {
    set({ [key]: value } as Partial<SettingsState>);

    clearTimeout(debounceTimers[key]);
    debounceTimers[key] = setTimeout(async () => {
      await updateSetting(key, value);
    }, 300);
  },

  resetSettings: () => {
    for (const key in debounceTimers) {
      clearTimeout(debounceTimers[key as keyof Settings]);
    }

    debounceTimers = {};
    set({ ...DEFAULT_UI_SETTINGS });

    for (const key in DEFAULT_UI_SETTINGS) {
      updateSetting(
        key as keyof Settings,
        DEFAULT_UI_SETTINGS[key as keyof Settings],
      );
    }
  },
}));

export const useSettingsActions = () =>
  useSettingsStore(
    useShallow((state) => ({
      loadSettings: state.loadSettings,
      setSetting: state.setSetting,
      resetSettings: state.resetSettings,
    })),
  );

export const useSidebarHidden = () =>
  useSettingsStore((state) => state.sidebarHidden);

export const useSidebarPosition = () =>
  useSettingsStore((state) => state.sidebarPosition);

export const useSidebarToolbarHidden = () =>
  useSettingsStore((state) => state.sidebarToolbarHidden);

export const useTopbarHidden = () =>
  useSettingsStore((state) => state.topbarHidden);

export const useCompactNestlingTitle = () =>
  useSettingsStore((state) => state.compactNestlingTitle);

export const useNestlingTitleHidden = () =>
  useSettingsStore((state) => state.nestlingTitleHidden);

export const useFolderIndentLines = () =>
  useSettingsStore((state) => state.folderIndentLines);

export const useFolderArrow = () =>
  useSettingsStore((state) => state.folderArrow);

export const useBlurStrength = () =>
  useSettingsStore((state) => state.blurStrength);

export const useMusicLooped = () =>
  useSettingsStore((state) => state.musicLooped);
