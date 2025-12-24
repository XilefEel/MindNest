import { getItem, setItem } from "./session";

type LastBackgroundMusics = Record<string, number>;

export async function saveLastBackgroundMusic(nestId: number, musicId: number) {
  const current =
    (await getItem<LastBackgroundMusics>("lastBackgroundMusic")) || {};
  current[nestId.toString()] = musicId;
  await setItem<LastBackgroundMusics>("lastBackgroundMusic", current);
}

export async function getLastBackgroundMusic(
  nestId: number | null,
): Promise<number | null> {
  if (nestId == null) return null;
  const current =
    (await getItem<LastBackgroundMusics>("lastBackgroundMusic")) || {};
  return current[nestId.toString()] ?? null;
}

export async function clearLastBackgroundMusic(nestId: number) {
  const current =
    (await getItem<LastBackgroundMusics>("lastBackgroundMusic")) || {};
  delete current[nestId.toString()];
  await setItem<LastBackgroundMusics>("lastBackgroundMusic", current);
}
