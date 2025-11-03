import { invoke } from "@tauri-apps/api/core";
import { Nest } from "../types/nest";

export async function createNest(userId: number, title: string) {
  await invoke<void>("create_nest", {
    userId,
    title,
  });
}

export async function getNests(userId: number) {
  return await invoke<Nest[]>("get_user_nests", {
    userId,
  });
}

export async function updateNest(nestId: number, newTitle: string) {
  await invoke<void>("update_nest", { nestId, newTitle });
}

export async function deleteNest(nestId: number) {
  await invoke<void>("delete_nest", { nestId });
}

export async function getNestFromId(nestId: number) {
  return await invoke<Nest>("get_nest_by_id", { nestId });
}
