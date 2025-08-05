import { Store } from "@tauri-apps/plugin-store";
import { User, Nestling } from "./types";

let storePromise: Promise<Store> | null = null;

// Load the store in .mindnest-auth.dat
function getStore() {
  if (!storePromise) {
    storePromise = Store.load(".mindnest-auth.dat");
  }
  return storePromise;
}

// Save the user info to the store
export async function saveUserSession(userId: User) {
  const store = await getStore();
  await store.set("user", userId);
  await store.save();
}

// Load the user info from the store
export async function getUserSession() {
  const store = await getStore();
  return await store.get<User>("user");
}

// Clear the user info from the store
export async function clearUserSession() {
  const store = await getStore();
  await store.delete("user");
  await store.save();
}

// Save the last nest id selected
export async function saveLastNestId(nestId: number) {
  const store = await getStore();
  await store.set("lastNestId", nestId);
  await store.save();
}

// Load the last nest id selected
export async function getLastNestId(): Promise<number | null> {
  const store = await getStore();
  return (await store.get<number>("lastNestId")) ?? null;
}

// Clear the last nest id selected
export async function clearLastNestId() {
  const store = await getStore();
  await store.delete("lastNestId");
  await store.save();
}

// Save the last nestling selected
export async function saveLastNestling(nestling: Nestling) {
  const store = await getStore();
  await store.set("lastNestling", nestling);
  await store.save();
}

// Load the last nestling selected
export async function getLastNestling(): Promise<Nestling | null> {
  const store = await getStore();
  return (await store.get<Nestling>("lastNestling")) ?? null;
}

// Clear the last nestling selected
export async function clearLastNestling() {
  const store = await getStore();
  await store.delete("lastNestling");
  await store.save();
}
