import { invoke } from "@tauri-apps/api/core";
import { Nest } from "./types";

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
