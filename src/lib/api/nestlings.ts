import { invoke } from "@tauri-apps/api/core";
import { Nestling, NewNestling } from "../types/nestlings";

export async function createNestling(data: NewNestling) {
  return await invoke<Nestling>("create_nestling", { data });
}

export async function getNestlings(nestId: number) {
  return await invoke<Nestling[]>("get_nestlings", { nestId });
}

export async function editNestling(
  id: number,
  folderId: number | null,
  title?: string | null,
  content?: string | null,
) {
  await invoke<void>("update_nestling", {
    id,
    folderId,
    title,
    content,
  });
}

export async function deleteNestling(nestlingId: number) {
  await invoke<void>("delete_nestling", { id: nestlingId });
}
