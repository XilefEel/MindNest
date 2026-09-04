import { invoke } from "@tauri-apps/api/core";
import { Nest } from "../types/nest";

export async function createNest(title: string) {
  await invoke<void>("create_nest", {
    data: {
      title,
    },
  });
}

export async function getNests() {
  return await invoke<Nest[]>("get_nests");
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
