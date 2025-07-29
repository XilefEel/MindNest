import { invoke } from "@tauri-apps/api/core";
import { NewNestling, NewFolder } from "./types";

export async function createNestling(data: NewNestling) {
  return await invoke("create_nestling", { data });
}

export async function getNestlings(nestId: number) {
  return await invoke("get_nestlings", { nestId });
}

export async function createFolder(data: NewFolder) {
  return await invoke("create_folder", { data });
}

export async function getFolders(nestId: number) {
  return await invoke("get_folders", { nestId });
}

export async function updateNestlingFolder(
  nestlingId: number,
  folderId: number,
) {
  return await invoke("update_folder", {
    id: nestlingId,
    folderId,
  });
}
