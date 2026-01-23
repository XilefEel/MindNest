import { invoke } from "@tauri-apps/api/core";
import { Bookmark } from "../types/bookmark";

export async function createBookmark(nestlingId: number, url: string) {
  return await invoke<Bookmark>("create_bookmark", {
    nestlingId,
    url,
  });
}

export async function getBookmarks(nestlingId: number) {
  return await invoke<Bookmark[]>("get_bookmarks", { nestlingId });
}

export async function deleteBookmark(id: number) {
  return await invoke<void>("delete_bookmark", { id });
}
