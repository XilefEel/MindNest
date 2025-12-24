import { Store } from "@tauri-apps/plugin-store";
import { User } from "@/lib/types/user";

let storePromise: Promise<Store> | null = null;

type LastNestlings = Record<string, number>;
type LastBackgroundImages = Record<string, number>;
type LastBackgroundMusics = Record<string, number>;
type RecentNestlings = Record<string, number[]>;

function getStore() {
  if (!storePromise) {
    storePromise = Store.load(".mindnest-auth.dat");
  }
  return storePromise;
}

async function setItem<T>(key: string, value: T) {
  const store = await getStore();
  await store.set(key, value);
  await store.save();
}

async function getItem<T>(key: string): Promise<T | null> {
  const store = await getStore();
  return (await store.get<T>(key)) ?? null;
}

async function deleteItem(key: string) {
  const store = await getStore();
  await store.delete(key);
  await store.save();
}

export async function saveUserSession(user: User) {
  return setItem("user", user);
}

export async function getUserSession(): Promise<User | null> {
  return getItem<User>("user");
}

export async function clearUserSession() {
  return deleteItem("user");
}

export async function saveLastNestId(nestId: number) {
  return setItem("lastNestId", nestId);
}

export async function getLastNestId(): Promise<number | null> {
  return getItem<number>("lastNestId");
}

export async function clearLastNestId() {
  return deleteItem("lastNestId");
}

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
