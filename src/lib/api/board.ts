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
  orderIndex,
  color,
}: {
  id: number;
  title: string;
  orderIndex: number;
  color: string;
}) {
  await invoke<void>("update_board_column", {
    id,
    title,
    orderIndex,
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
  orderIndex,
  columnId,
}: {
  id: number;
  title: string;
  description: string | null;
  orderIndex: number;
  columnId: number;
}) {
  await invoke<void>("update_board_card", {
    id,
    title,
    description,
    orderIndex,
    columnId,
  });
}
export async function deleteBoardCard(id: number) {
  await invoke<void>("delete_board_card", { id });
}

export async function getBoard(nestlingId: number) {
  return await invoke<BoardData>("get_board_data", { nestlingId });
}
