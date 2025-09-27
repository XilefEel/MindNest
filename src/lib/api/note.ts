import { invoke } from "@tauri-apps/api/core";

export async function editNote(
  nestlingId: number,
  title: string | null,
  content: string | null,
) {
  await invoke<void>("edit_note", {
    id: nestlingId,
    title,
    content,
  });
}
