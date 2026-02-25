import { Store } from "@tauri-apps/plugin-store";

let storePromise: Promise<Store> | null = null;

function getStore() {
  if (!storePromise) {
    storePromise = Store.load(".mindnest.json");
  }
  return storePromise;
}

export async function setItem<T>(key: string, value: T) {
  const store = await getStore();
  await store.set(key, value);
  await store.save();
}

export async function getItem<T>(key: string): Promise<T | null> {
  const store = await getStore();
  return (await store.get<T>(key)) ?? null;
}

export async function deleteItem(key: string) {
  const store = await getStore();
  await store.delete(key);
  await store.save();
}

export async function getMap<T extends Record<string, any>>(
  key: string,
): Promise<T> {
  return (await getItem<T>(key)) || ({} as T);
}

export async function saveMap<T extends Record<string, any>>(
  key: string,
  map: T,
): Promise<void> {
  await setItem(key, map);
}
