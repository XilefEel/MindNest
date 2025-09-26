import { Store } from "@tauri-apps/plugin-store";
import { Nestling } from "@/lib/types/nestlings";
import { User } from "@/lib/types/user";

let storePromise: Promise<Store> | null = null;

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

// Save the user info to the store
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

export async function saveLastNestling(nestling: Nestling) {
  return setItem("lastNestling", nestling);
}

export async function getLastNestling(): Promise<Nestling | null> {
  return getItem<Nestling>("lastNestling");
}

export async function clearLastNestling() {
  return deleteItem("lastNestling");
}
