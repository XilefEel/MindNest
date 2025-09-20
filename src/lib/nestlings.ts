import { invoke } from "@tauri-apps/api/core";
import {
  NewNestling,
  NewFolder,
  NewBoardColumn,
  NewBoardCard,
  BoardData,
  BoardCard,
  BoardColumn,
  PlannerEventType,
  NewPlannerEventType,
  NewJournalEntry,
  JournalEntry,
  NewJournalTemplate,
  JournalTemplate,
  GalleryAlbum,
  NewGalleryAlbum,
  GalleryImage,
} from "./types";

export async function createNestling(data: NewNestling) {
  return await invoke("create_nestling", { data });
}

export async function getNestlings(nestId: number) {
  return await invoke("get_nestlings", { nestId });
}

export async function deleteNestling(nestlingId: number) {
  return await invoke("delete_nestling", { id: nestlingId });
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

export async function deleteFolder(folderId: number) {
  return await invoke("delete_folder", { id: folderId });
}

export async function editNote(
  nestlingId: number,
  title: string | null,
  content: string | null,
) {
  return await invoke<void>("edit_note", {
    id: nestlingId,
    title,
    content,
  });
}

export async function createBoardColumn(data: NewBoardColumn) {
  return await invoke<BoardColumn>("create_board_column", { data });
}

export async function updateBoardColumn({
  id,
  title,
  order_index,
}: {
  id: number;
  title: string;
  order_index: number;
}) {
  try {
    const result = await invoke("update_board_column", {
      id,
      title,
      orderIndex: order_index,
    });
    console.log("Invoke successful:", result);
    return result;
  } catch (error) {
    console.error("Invoke failed:", error);
    throw error;
  }
}

export async function deleteBoardColumn(id: number) {
  return await invoke("delete_board_column", { id });
}

export async function createBoardCard(data: NewBoardCard) {
  return await invoke<BoardCard>("create_board_card", { data });
}

export async function updateBoardCard({
  id,
  title,
  description,
  order_index,
  column_id,
}: {
  id: number;
  title: string;
  description: string | null;
  order_index: number;
  column_id: number;
}) {
  return await invoke("update_board_card", {
    id,
    title,
    description,
    orderIndex: order_index,
    columnId: column_id,
  });
}
export async function deleteBoardCard(id: number) {
  return await invoke("delete_board_card", { id });
}

export async function getBoard(nestlingId: number) {
  return await invoke<BoardData>("get_board_data", { nestlingId });
}

export async function createPlannerEvent(data: NewPlannerEventType) {
  console.log("createPlannerEvent", data);
  return await invoke<PlannerEventType>("create_event", { data });
}

export async function getPlannerEvents({
  id,
  start,
  end,
}: {
  id: number;
  start: string;
  end: string;
}) {
  console.log("getPlannerEvents", { id, start, end });
  try {
    const result = await invoke<PlannerEventType[]>("get_events", {
      nestlingId: id,
      start,
      end,
    });
    console.log("Success:", result);
    return result;
  } catch (error) {
    console.error("Tauri invoke error:", error);
    throw error;
  }
}

export async function updatePlannerEvent({
  id,
  date,
  title,
  description,
  start_time,
  duration,
  color,
}: {
  id: number;
  date: string;
  title: string;
  description: string | null;
  start_time: number;
  duration: number;
  color: string | null;
}) {
  return await invoke("update_event", {
    id,
    date,
    title,
    description,
    startTime: start_time,
    duration,
    color,
  });
}

export async function deletePlannerEvent(id: number) {
  return await invoke("delete_event", { id });
}

export async function createJournalEntry(data: NewJournalEntry) {
  return await invoke<JournalEntry>("insert_journal_entry", { data });
}

export async function getJournalEntries(nestlingId: number) {
  return await invoke<JournalEntry[]>("get_journal_entries", { nestlingId });
}

export async function updateJournalEntry(
  id: number,
  title: string,
  content: string,
  entryDate: string,
) {
  return await invoke("update_journal_entry", {
    id,
    title,
    content,
    entryDate,
  });
}

export async function deleteJournalEntry(id: number) {
  return await invoke("delete_journal_entry", { id });
}

export async function createJournalTemplate(data: NewJournalTemplate) {
  return await invoke<JournalTemplate>("insert_journal_template", { data });
}

export async function getJournalTemplates(nestlingId: number) {
  return await invoke<JournalTemplate[]>("get_journal_templates", {
    nestlingId,
  });
}

export async function updateJournalTemplate(
  id: number,
  name: string,
  content: string,
) {
  return await invoke("update_journal_template", { id, name, content });
}

export async function deleteJournalTemplate(id: number) {
  return await invoke("delete_journal_template", { id });
}

export async function importImage(
  nestlingId: number,
  filePath: string,
  albumId?: number | null,
) {
  return await invoke<GalleryImage>("import_image", {
    nestlingId,
    albumId,
    filePath,
  });
}

export async function importImageData(
  nestlingId: number,
  fileName: string,
  fileData: number[],
  albumId?: number | null,
) {
  return await invoke<GalleryImage>("import_image_data", {
    nestlingId,
    albumId,
    fileName,
    fileData,
  });
}

export async function getImages(nestlingId: number) {
  return await invoke<GalleryImage[]>("get_images", { nestlingId });
}

export async function downloadImage(id: number, savePath: string) {
  return await invoke("download_image", { id, savePath });
}

export async function downloadAlbum(id: number, savePath: string) {
  return await invoke("download_album", { id, savePath });
}

export async function updateImage(
  id: number,
  albumId: number | null,
  title: string | null,
  description: string | null,
  tags: string | null,
) {
  return await invoke<void>("update_image", {
    id,
    albumId,
    title,
    description,
    tags,
  });
}

export async function deleteImage(id: number) {
  return await invoke<void>("delete_image", { id });
}

export async function createAlbum(data: NewGalleryAlbum) {
  return await invoke<GalleryAlbum>("create_album", { data });
}

export async function getAlbums(nestlingId: number) {
  return await invoke<GalleryAlbum[]>("get_albums", { nestlingId });
}

export async function updateAlbum(
  id: number,
  name: string | null,
  description: string | null,
) {
  return await invoke<void>("update_album", { id, name, description });
}

export async function deleteAlbum(id: number) {
  return await invoke<void>("delete_album", { id });
}
