import { invoke } from "@tauri-apps/api/core";
import { Nestling, NewNestling } from "../types/nestlings";

export async function createNestling(data: NewNestling) {
  await invoke<void>("create_nestling", { data });
}

export async function getNestlings(nestId: number) {
  return await invoke<Nestling[]>("get_nestlings", { nestId });
}

export async function deleteNestling(nestlingId: number) {
  await invoke<void>("delete_nestling", { id: nestlingId });
}
