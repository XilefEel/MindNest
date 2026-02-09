import { invoke } from "@tauri-apps/api/core";
import { NewTag, Tag } from "../types/tag";

export async function createTag(data: NewTag): Promise<Tag> {
  return await invoke("create_tag", { data });
}

export async function getTags(nestId: number): Promise<Tag[]> {
  return await invoke("get_tags", { nestId });
}

export async function updateTag(
  id: number,
  name?: string,
  color?: string,
): Promise<void> {
  return await invoke("update_tag", { id, name, color });
}

export async function deleteTag(id: number): Promise<void> {
  return await invoke("delete_tag", { id });
}

export async function attachTag(
  nestlingId: number,
  tagId: number,
): Promise<void> {
  return await invoke("attach_tag", { nestlingId, tagId });
}

export async function getAllNestlingTags(
  nestId: number,
): Promise<Record<number, Tag[]>> {
  return await invoke("get_all_nestling_tags", { nestId });
}

export async function detachTag(
  nestlingId: number,
  tagId: number,
): Promise<void> {
  return await invoke("detach_tag", { nestlingId, tagId });
}
