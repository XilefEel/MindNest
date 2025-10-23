import { invoke } from "@tauri-apps/api/core";
import {
  NewBoardColumn,
  BoardColumn,
  NewBoardCard,
  BoardCard,
  BoardData,
} from "../types/board";

export async function createBoardColumn(data: NewBoardColumn) {
  return await invoke<BoardColumn>("create_board_column", { data });
}

export async function updateBoardColumn({
  id,
  title,
  order_index,
  color,
}: {
  id: number;
  title: string;
  order_index: number;
  color: string;
}) {
  await invoke<void>("update_board_column", {
    id,
    title,
    orderIndex: order_index,
    color,
  });
}

export async function deleteBoardColumn(id: number) {
  await invoke<void>("delete_board_column", { id });
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
  await invoke<void>("update_board_card", {
    id,
    title,
    description,
    orderIndex: order_index,
    columnId: column_id,
  });
}
export async function deleteBoardCard(id: number) {
  await invoke<void>("delete_board_card", { id });
}

export async function getBoard(nestlingId: number) {
  return await invoke<BoardData>("get_board_data", { nestlingId });
}
