import { getMap, saveMap } from "./storage";

type LastBackgroundMusics = Record<string, number>;
const KEY = "lastBackgroundMusic";

export async function getLastBackgroundMusic(
  nestId: number | null,
): Promise<number | null> {
  if (nestId == null) return null;
  const map = await getMap<LastBackgroundMusics>(KEY);
  return map[nestId.toString()] ?? null;
}

export async function saveLastBackgroundMusic(nestId: number, musicId: number) {
  const map = await getMap<LastBackgroundMusics>(KEY);
  map[nestId.toString()] = musicId;
  await saveMap<LastBackgroundMusics>(KEY, map);
}

export async function clearLastBackgroundMusic(nestId: number) {
  const map = await getMap<LastBackgroundMusics>(KEY);
  delete map[nestId.toString()];
  await saveMap<LastBackgroundMusics>(KEY, map);
}
