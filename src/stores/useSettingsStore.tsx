import {
  DEFAULT_UI_SETTINGS,
  loadSettings,
  Settings,
  updateSetting,
} from "@/lib/storage/settings";
import { create } from "zustand";

let debounceTimers: Partial<
  Record<keyof Settings, ReturnType<typeof setTimeout>>
> = {};

type SettingsState = Settings & {
  loaded: boolean;
  loadSettings: () => Promise<void>;
  setSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
};

export const useSettingsStore = create<SettingsState>((set) => ({
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
}));
