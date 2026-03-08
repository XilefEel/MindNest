import { getMap, saveMap } from "./storage";

type LastBackgroundImages = Record<string, number>;
type StoredBackgroundImages = Record<string, number>;
type LastBackgroundImageBrightness = Record<string, number>;

const LAST_BACKGROUND_IMAGE_KEY = "lastBackgroundImages";
const STORED_BACKGROUND_IMAGE_KEY = "storedBackgroundImages";
const LAST_BACKGROUND_IMAGE_BRIGHTNESS_KEY = "LastBackgroundImageBrightness";

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

export async function getLastBackgroundImageBrightness(
  nestId: number | null,
): Promise<number | null> {
  if (nestId == null) return null;
  const map = await getMap<LastBackgroundImageBrightness>(
    LAST_BACKGROUND_IMAGE_BRIGHTNESS_KEY,
  );
  return map[nestId.toString()] ?? null;
}

export async function saveLastBackgroundImageBrightness(
  nestId: number,
  brightness: number,
) {
  const map = await getMap<LastBackgroundImageBrightness>(
    LAST_BACKGROUND_IMAGE_BRIGHTNESS_KEY,
  );
  map[nestId.toString()] = brightness;
  await saveMap<LastBackgroundImageBrightness>(
    LAST_BACKGROUND_IMAGE_BRIGHTNESS_KEY,
    map,
  );
}

export async function clearLastBackgroundImageBrightness(nestId: number) {
  const map = await getMap<LastBackgroundImageBrightness>(
    LAST_BACKGROUND_IMAGE_BRIGHTNESS_KEY,
  );
  delete map[nestId.toString()];
  await saveMap<LastBackgroundImageBrightness>(
    LAST_BACKGROUND_IMAGE_BRIGHTNESS_KEY,
    map,
  );
}
