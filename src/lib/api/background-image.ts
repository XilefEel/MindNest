import { invoke } from "@tauri-apps/api/core";
import { BackgroundImage } from "../types/background-image";

export async function importBackground(nestId: number, filePath: string) {
  return await invoke<BackgroundImage>("import_background", {
    nestId,
    filePath,
  });
}

export async function getBackgrounds(nestId: number) {
  return await invoke<BackgroundImage[]>("get_backgrounds", { nestId });
}

export async function removeBackground(id: number) {
  await invoke<void>("delete_background", { id });
}
