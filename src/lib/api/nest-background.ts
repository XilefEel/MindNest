import { invoke } from "@tauri-apps/api/core";
import { BackgroundImage, NewBackgroundImage } from "../types/nest_backgrounds";

export async function addBackground(data: NewBackgroundImage) {
  return await invoke<BackgroundImage>("add_background", { data });
}

export async function importBackground(nestId: number, filePath: string) {
  await invoke<void>("import_background", { nestId, filePath });
}

export async function setBackground(nestId: number, backgroundId: number) {
  await invoke<void>("set_background", { nestId, backgroundId });
}

export async function getBackgrounds(nestId: number) {
  return await invoke<BackgroundImage[]>("get_backgrounds", { nestId });
}

export async function deleteBackground(nestId: number) {
  await invoke<void>("delete_background", { nestId });
}
