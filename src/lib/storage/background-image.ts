import { getMap, saveMap } from "./storage";

type LastBackgroundImages = Record<string, number>;
type StoredBackgroundImages = Record<string, number>;

const LAST_BACKGROUND_IMAGE_KEY = "lastBackgroundImages";
const STORED_BACKGROUND_IMAGE_KEY = "storedBackgroundImages";

export async function getLastBackgroundImage(
  nestId: number | null,
): Promise<number | null> {
  if (nestId == null) return null;
  const map = await getMap<LastBackgroundImages>(LAST_BACKGROUND_IMAGE_KEY);
  return map[nestId.toString()] ?? null;
}

export async function saveLastBackgroundImage(nestId: number, imageId: number) {
  const map = await getMap<LastBackgroundImages>(LAST_BACKGROUND_IMAGE_KEY);
  map[nestId.toString()] = imageId;
  await saveMap<LastBackgroundImages>(LAST_BACKGROUND_IMAGE_KEY, map);
}

export async function clearLastBackgroundImage(nestId: number) {
  const map = await getMap<LastBackgroundImages>(LAST_BACKGROUND_IMAGE_KEY);
  delete map[nestId.toString()];
  await saveMap<LastBackgroundImages>(LAST_BACKGROUND_IMAGE_KEY, map);
}

export async function getStoredBackgroundImage(
  nestId: number | null,
): Promise<number | null> {
  if (nestId == null) return null;
  const map = await getMap<StoredBackgroundImages>(STORED_BACKGROUND_IMAGE_KEY);
  return map[nestId.toString()] ?? null;
}

export async function saveStoredBackgroundImage(
  nestId: number,
  imageId: number,
) {
  const map = await getMap<StoredBackgroundImages>(STORED_BACKGROUND_IMAGE_KEY);
  map[nestId.toString()] = imageId;
  await saveMap<StoredBackgroundImages>(STORED_BACKGROUND_IMAGE_KEY, map);
}

export async function clearStoredBackgroundImage(nestId: number) {
  const map = await getMap<StoredBackgroundImages>(STORED_BACKGROUND_IMAGE_KEY);
  delete map[nestId.toString()];
  await saveMap<StoredBackgroundImages>(STORED_BACKGROUND_IMAGE_KEY, map);
}
