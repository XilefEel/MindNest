import { getItem, setItem } from "./session";

type LastBackgroundImages = Record<string, number>;

export async function saveLastBackgroundImage(
  nestId: number,
  backgroundId: number,
) {
  const current =
    (await getItem<LastBackgroundImages>("lastBackgroundImage")) || {};
  current[nestId.toString()] = backgroundId;
  await setItem<LastBackgroundImages>("lastBackgroundImage", current);
}

export async function getLastBackgroundImage(
  nestId: number | null,
): Promise<number | null> {
  if (nestId == null) return null;
  const current =
    (await getItem<LastBackgroundImages>("lastBackgroundImage")) || {};
  return current[nestId.toString()] ?? null;
}

export async function clearLastBackgroundImage(nestId: number) {
  const current =
    (await getItem<LastBackgroundImages>("lastBackgroundImage")) || {};
  delete current[nestId.toString()];
  await setItem<LastBackgroundImages>("lastBackgroundImage", current);
}
