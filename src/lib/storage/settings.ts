import { getMap, saveMap } from "./storage";

export type BlurStrength = "low" | "medium" | "high";

export type Settings = {
  topbarHidden: boolean;
  sidebarHidden: boolean;
  sidebarPosition: "left" | "right";
  compactNestlingTitle: boolean;
  nestlingTitleHidden: boolean;
  folderIndentLines: boolean;
  folderArrow: boolean;
  blurStrength: BlurStrength;
  musicLooped: boolean;
};

export const DEFAULT_UI_SETTINGS: Settings = {
  topbarHidden: false,
  sidebarHidden: false,
  sidebarPosition: "left",
  compactNestlingTitle: false,
  nestlingTitleHidden: false,
  folderIndentLines: true,
  folderArrow: true,
  blurStrength: "low",
  musicLooped: false,
};

const KEY = "uiSettings";

export async function loadSettings(): Promise<Settings> {
  const saved = await getMap<Partial<Settings>>(KEY);

  return {
    ...DEFAULT_UI_SETTINGS,
    ...saved,
  };
}

export async function updateSetting<K extends keyof Settings>(
  key: K,
  value: Settings[K],
): Promise<void> {
  const current = await loadSettings();
  current[key] = value;
  await saveMap<Settings>(KEY, current);
}
