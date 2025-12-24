import { invoke } from "@tauri-apps/api/core";
import { NewBackgroundMusic, BackgroundMusic } from "../types/background-music";

export async function addMusic(data: NewBackgroundMusic) {
  return await invoke<BackgroundMusic>("add_music", { data });
}

export async function importMusic(
  nestId: number,
  filePath: string,
  title: string,
  durationSeconds: number,
  orderIndex: number,
) {
  return await invoke<BackgroundMusic>("import_music", {
    nestId,
    filePath,
    title,
    durationSeconds,
    orderIndex,
  });
}

export async function getMusic(nestId: number) {
  return await invoke<BackgroundMusic[]>("get_music", { nestId });
}

export async function updateMusic(
  id: number,
  title: string,
  orderIndex: number,
) {
  await invoke<void>("update_music", { id, title, orderIndex });
}

export async function updateMusicSelection(nestId: number, musicId: number) {
  await invoke<void>("update_music_selection", { nestId, musicId });
}

export async function clearMusicSelection(nestId: number) {
  await invoke<void>("clear_music_selection", { nestId });
}

export async function deleteMusic(id: number) {
  await invoke<void>("delete_music", { id });
}
