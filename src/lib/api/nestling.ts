import { invoke } from "@tauri-apps/api/core";
import { Nestling, NewNestling } from "../types/nestling";

export async function createNestling(data: NewNestling) {
  return await invoke<Nestling>("create_nestling", { data });
}

export async function getNestlings(nestId: number) {
  return await invoke<Nestling[]>("get_nestlings", { nestId });
}

export async function editNestling({
  id,
  folderId,
  icon,
  isPinned,
  title,
  content,
}: {
  id: number;
  folderId: number | null;
  icon: string | null;
  isPinned: boolean;
  title: string | null;
  content: string | null;
}) {
  await invoke<void>("update_nestling", {
    id,
    folderId,
    icon,
    isPinned,
    title,
    content,
  });
}

export async function deleteNestling(nestlingId: number) {
  await invoke<void>("delete_nestling", { id: nestlingId });
}
