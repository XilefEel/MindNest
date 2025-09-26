import { invoke } from "@tauri-apps/api/core";
import { Nest } from "../types/nests";

export async function createNest(userId: number, title: string) {
  return await invoke<void>("create_nest", {
    data: {
      user_id: userId,
      title: title,
    },
  });
}

export async function getUserNests(userId: number) {
  return await invoke<Nest[]>("get_user_nests", {
    userId,
  });
}

export async function updateNest(nestId: number, newTitle: string) {
  return await invoke<void>("update_nest", { nestId, newTitle });
}

export async function deleteNest(nestId: number) {
  return await invoke<void>("delete_nest", { nestId });
}

export async function getNestFromId(nestId: number) {
  return await invoke<Nest>("get_nest_by_id", { nestId });
}
