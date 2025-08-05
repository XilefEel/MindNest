import { invoke } from "@tauri-apps/api/core";
import { NewNestling, NewFolder } from "./types";

/*
Functions to create, get, update, and delete nestlings from the database using Tauri
 */

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
  folderId: number | null,
) {
  return await invoke("update_folder", {
    id: nestlingId,
    folderId,
  });
}

export async function editNote(
  nestlingId: number,
  title: string | null,
  content: string | null,
) {
  return await invoke("edit_note", {
    id: nestlingId,
    title,
    content,
  });
}
