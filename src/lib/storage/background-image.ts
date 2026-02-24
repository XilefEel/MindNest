import { getMap, saveMap } from "./storage";

type LastBackgroundImages = Record<string, number>;
const KEY = "lastBackgroundImage";

export async function getLastBackgroundImage(
  nestId: number | null,
): Promise<number | null> {
  if (nestId == null) return null;
  const map = await getMap<LastBackgroundImages>(KEY);
  return map[nestId.toString()] ?? null;
}

export async function saveLastBackgroundImage(nestId: number, imageId: number) {
  const map = await getMap<LastBackgroundImages>(KEY);
  map[nestId.toString()] = imageId;
  await saveMap<LastBackgroundImages>(KEY, map);
}

export async function clearLastBackgroundImage(nestId: number) {
  const map = await getMap<LastBackgroundImages>(KEY);
  delete map[nestId.toString()];
  await saveMap<LastBackgroundImages>(KEY, map);
}
