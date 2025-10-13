import { invoke } from "@tauri-apps/api/core";
import { Folder, NewFolder } from "../types/folder";

export async function createFolder(data: NewFolder) {
  return await invoke<Folder>("create_folder", { data });
}

export async function getFolders(nestId: number) {
  return await invoke<Folder[]>("get_folders", { nestId });
}

export async function updateFolder(
  id: number,
  parentId?: number | null,
  name?: string | null,
) {
  await invoke<void>("update_folder", { id, parentId, name });
}

export async function deleteFolder(folderId: number) {
  await invoke<void>("delete_folder", { id: folderId });
}
