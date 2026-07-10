import { invoke } from "@tauri-apps/api/core";
import { BackgroundMusic } from "../types/background-music";

export async function importMusic(nestId: number, filePath: string) {
  return await invoke<BackgroundMusic>("import_music", {
    nestId,
    filePath,
  });
}

export async function getMusic(nestId: number) {
  return await invoke<BackgroundMusic[]>("get_music", { nestId });
}

export async function updateMusic(id: number, title: string) {
  await invoke<void>("update_music", { id, title });
}

export async function deleteMusic(id: number) {
  await invoke<void>("delete_music", { id });
}
