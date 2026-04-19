import { getMap, saveMap } from "./storage";

export type Settings = {
  sidebarHidden: boolean;
  topbarHidden: boolean;
  nestlingTitleHidden: boolean;
  largeSidebarText: boolean;
  folderIndentLines: boolean;
  folderArrow: boolean;
  musicLooped: boolean;
};

export const DEFAULT_UI_SETTINGS: Settings = {
  sidebarHidden: false,
  topbarHidden: false,
  nestlingTitleHidden: false,
  largeSidebarText: false,
  folderIndentLines: true,
  folderArrow: true,
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
