import { invoke } from "@tauri-apps/api/core";
import { Nest } from "./types";

/*
Functions to create, get, update, and delete nests from the database using Tauri
 */

export async function createNest(userId: number, title: string) {
  return await invoke("create_nest", {
    data: {
      user_id: userId,
      title: title,
    },
  });
}

export async function getUserNests(userId: number) {
  try {
    const result = await invoke<Nest[]>("get_user_nests", {
      userId,
    });
    return result;
  } catch (error) {
    console.error("Error fetching nests:", error);
    return [];
  }
}

export async function updateNest(nestId: number, newTitle: string) {
  return await invoke("update_nest", { nestId, newTitle });
}

export async function deleteNest(nestId: number) {
  return await invoke("delete_nest", { nestId });
}

export async function getNestFromId(nestId: number) {
  return await invoke<Nest>("get_nest_by_id", { nestId });
}
