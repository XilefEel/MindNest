import { invoke } from "@tauri-apps/api/core";
import { Folder, NewFolder } from "../types/folders";

export async function createFolder(data: NewFolder) {
  return await invoke<void>("create_folder", { data });
}

export async function getFolders(nestId: number) {
  return await invoke<Folder[]>("get_folders", { nestId });
}

export async function updateNestlingFolder(
  nestlingId: number,
  folderId: number | null,
) {
  return await invoke<void>("update_folder", {
    id: nestlingId,
    folderId,
  });
}

export async function deleteFolder(folderId: number) {
  return await invoke<void>("delete_folder", { id: folderId });
}
