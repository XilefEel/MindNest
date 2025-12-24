import { Store } from "@tauri-apps/plugin-store";

let storePromise: Promise<Store> | null = null;

function getStore() {
  if (!storePromise) {
    storePromise = Store.load(".mindnest-auth.dat");
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
