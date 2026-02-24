import {
  DEFAULT_UI_SETTINGS,
  loadSettings,
  Settings,
  updateSetting,
} from "@/lib/storage/settings";
import { create } from "zustand";

type SettingsState = Settings & {
  loaded: boolean;

  loadSettings: () => Promise<void>;
  setSetting: <K extends keyof Settings>(
    key: K,
    value: Settings[K],
  ) => Promise<void>;
};

export const useSettingsStore = create<SettingsState>((set) => ({
  ...DEFAULT_UI_SETTINGS,

  loaded: false,

  loadSettings: async () => {
    const settings = await loadSettings();
    set({
      ...settings,
      loaded: true,
    });
  },

  setSetting: async (key, value) => {
    set({ [key]: value } as Partial<SettingsState>);
    await updateSetting(key, value);
  },
}));
