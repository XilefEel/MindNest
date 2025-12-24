import { getItem, setItem } from "./session";

type LastNestlings = Record<string, number>;
type RecentNestlings = Record<string, number[]>;

export async function saveLastNestling(nestId: number, nestlingId: number) {
  const current = (await getItem<LastNestlings>("lastNestlings")) || {};
  current[nestId.toString()] = nestlingId;
  await setItem<LastNestlings>("lastNestlings", current);
}

export async function getLastNestling(
  nestId: number | null,
): Promise<number | null> {
  if (nestId == null) return null;
  const current = (await getItem<LastNestlings>("lastNestlings")) || {};
  return current[nestId.toString()] ?? null;
}

export async function clearLastNestling(nestId: number) {
  const current = (await getItem<LastNestlings>("lastNestlings")) || {};
  delete current[nestId.toString()];
  await setItem<LastNestlings>("lastNestlings", current);
}

export async function saveRecentNestling(
  nestId: number,
  recentNestlingId: number,
) {
  const current = (await getItem<RecentNestlings>("recentNestlings")) || {};

  const key = nestId.toString();
  const currentList = current[key] ?? [];

  const updatedList = [
    recentNestlingId,
    ...currentList.filter((item) => item !== recentNestlingId),
  ];
  current[key] = updatedList.slice(0, 10);

  await setItem<RecentNestlings>("recentNestlings", current);
}

export async function getRecentNestlings(
  nestId: number | null,
): Promise<number[] | null> {
  if (nestId == null) return [];
  const current = (await getItem<RecentNestlings>("recentNestlings")) || {};
  return current[nestId.toString()] ?? [];
}

export async function clearRecentNestlings(nestId: number) {
  const current = (await getItem<RecentNestlings>("recentNestlings")) || {};
  delete current[nestId.toString()];
  await setItem<RecentNestlings>("recentNestlings", current);
}
