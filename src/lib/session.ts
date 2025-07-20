// src/utils/session.ts
import { Store } from "@tauri-apps/plugin-store";
import { User } from "./types";

let storePromise: Promise<Store> | null = null;

function getStore() {
  if (!storePromise) {
    storePromise = Store.load(".mindnest-auth.dat");
  }
  return storePromise;
}

export async function saveUserSession(userId: User) {
  const store = await getStore();
  await store.set("user", userId);
  await store.save();
}

export async function getUserSession() {
  const store = await getStore();
  return await store.get<User>("user");
}

export async function clearUserSession() {
  const store = await getStore();
  await store.delete("user");
  await store.save();
}
