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
} from "./types";

/*
Functions to create, get, update, and delete nestlings from the database using Tauri
 */

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
  return await invoke("edit_note", {
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
