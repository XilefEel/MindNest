import { getMap, saveMap } from "./storage";

type LastNestlings = Record<string, number>;
type RecentNestlings = Record<string, number[]>;

const LAST_NESTLING_KEY = "lastNestlings";
const RECENT_NESTLINGS_KEY = "recentNestlings";

export async function getLastNestling(
  nestId: number | null,
): Promise<number | null> {
  if (nestId == null) return null;
  const map = await getMap<LastNestlings>(LAST_NESTLING_KEY);
  return map[nestId.toString()] ?? null;
}

export async function saveLastNestling(nestId: number, nestlingId: number) {
  const map = await getMap<LastNestlings>(LAST_NESTLING_KEY);
  map[nestId.toString()] = nestlingId;
  await saveMap<LastNestlings>(LAST_NESTLING_KEY, map);
}

export async function clearLastNestling(nestId: number) {
  const map = await getMap<LastNestlings>(LAST_NESTLING_KEY);
  delete map[nestId.toString()];
  await saveMap<LastNestlings>(LAST_NESTLING_KEY, map);
}

export async function getRecentNestlings(
  nestId: number | null,
): Promise<number[]> {
  if (nestId == null) return [];
  const map = await getMap<RecentNestlings>(RECENT_NESTLINGS_KEY);
  return map[nestId.toString()] ?? [];
}

export async function saveRecentNestling(
  nestId: number,
  recentNestlingId: number,
) {
  const map = await getMap<RecentNestlings>(RECENT_NESTLINGS_KEY);
  const key = nestId.toString();

  const currentList = map[key] ?? [];
  const updatedList = [
    recentNestlingId,
    ...currentList.filter((id) => id !== recentNestlingId),
  ];

  map[key] = updatedList.slice(0, 10);
  await saveMap<RecentNestlings>(RECENT_NESTLINGS_KEY, map);
}

export async function clearRecentNestlings(nestId: number) {
  const map = await getMap<RecentNestlings>(RECENT_NESTLINGS_KEY);
  delete map[nestId.toString()];
  await saveMap<RecentNestlings>(RECENT_NESTLINGS_KEY, map);
}
