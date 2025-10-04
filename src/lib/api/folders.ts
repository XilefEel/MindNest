import { invoke } from "@tauri-apps/api/core";
import { Folder, NewFolder } from "../types/folders";

export async function createFolder(data: NewFolder) {
  return await invoke<Folder>("create_folder", { data });
}

export async function getFolders(nestId: number) {
  return await invoke<Folder[]>("get_folders", { nestId });
}

export async function updateFolder(id: number, name: string) {
  await invoke<void>("update_folder", { id, name });
}

export async function deleteFolder(folderId: number) {
  await invoke<void>("delete_folder", { id: folderId });
}
