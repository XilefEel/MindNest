import { invoke } from "@tauri-apps/api/core";
import { BackgroundImage, NewBackgroundImage } from "../types/nest_backgrounds";

export async function addBackground(data: NewBackgroundImage) {
  return await invoke<BackgroundImage>("add_background", { data });
}

export async function importBackground(nestId: number, filePath: string) {
  return await invoke<BackgroundImage>("import_background", {
    nestId,
    filePath,
  });
}

export async function getBackgrounds(nestId: number) {
  return await invoke<BackgroundImage[]>("get_backgrounds", { nestId });
}

export async function deleteBackground(id: number) {
  await invoke<void>("delete_background", { id });
}
