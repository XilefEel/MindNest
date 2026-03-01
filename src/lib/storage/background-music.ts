import { getMap, saveMap } from "./storage";

type LastBackgroundMusics = Record<string, number>;
type LastMusicVolumes = Record<string, number>;

const LAST_BACKGROUND_MUSIC_KEY = "lastBackgroundMusic";
const LAST_MUSIC_VOLUME_KEY = "lastMusicVolumes";

export async function getLastBackgroundMusic(
  nestId: number | null,
): Promise<number | null> {
  if (nestId == null) return null;
  const map = await getMap<LastBackgroundMusics>(LAST_BACKGROUND_MUSIC_KEY);
  return map[nestId.toString()] ?? null;
}

export async function saveLastBackgroundMusic(nestId: number, musicId: number) {
  const map = await getMap<LastBackgroundMusics>(LAST_BACKGROUND_MUSIC_KEY);
  map[nestId.toString()] = musicId;
  await saveMap<LastBackgroundMusics>(LAST_BACKGROUND_MUSIC_KEY, map);
}

export async function clearLastBackgroundMusic(nestId: number) {
  const map = await getMap<LastBackgroundMusics>(LAST_BACKGROUND_MUSIC_KEY);
  delete map[nestId.toString()];
  await saveMap<LastBackgroundMusics>(LAST_BACKGROUND_MUSIC_KEY, map);
}

export async function getLastMusicVolume(
  nestId: number | null,
): Promise<number | null> {
  if (nestId == null) return null;
  const map = await getMap<LastMusicVolumes>(LAST_MUSIC_VOLUME_KEY);
  return map[nestId.toString()] ?? null;
}

export async function saveLastMusicVolume(nestId: number, volume: number) {
  const map = await getMap<LastMusicVolumes>(LAST_MUSIC_VOLUME_KEY);
  map[nestId.toString()] = volume;
  await saveMap<LastMusicVolumes>(LAST_MUSIC_VOLUME_KEY, map);
}

export async function clearLastMusicVolume(nestId: number) {
  const map = await getMap<LastMusicVolumes>(LAST_MUSIC_VOLUME_KEY);
  delete map[nestId.toString()];
  await saveMap<LastMusicVolumes>(LAST_MUSIC_VOLUME_KEY, map);
}
