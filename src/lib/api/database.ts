import { invoke } from "@tauri-apps/api/core";
import {
  NewDbColumn,
  DbColumn,
  NewDbRow,
  DbRow,
  NewDbCell,
  DbCell,
  DbData,
} from "../types/database";

export async function getDbData(nestlingId: number) {
  return await invoke<DbData>("get_db_data", { nestlingId });
}

export async function createDbColumn(data: NewDbColumn) {
  return await invoke<DbColumn>("create_db_column", { data });
}

export async function updateDbColumn({
  id,
  name,
  orderIndex,
}: {
  id: number;
  name: string;
  orderIndex: number;
}) {
  await invoke<void>("update_db_column", { id, name, orderIndex });
}

export async function deleteDbColumn(id: number) {
  await invoke<void>("delete_db_column", { id });
}

export async function createDbRow(data: NewDbRow) {
  return await invoke<DbRow>("create_db_row", { data });
}

export async function deleteDbRow(id: number) {
  await invoke<void>("delete_db_row", { id });
}

export async function upsertDbCell(data: NewDbCell) {
  return await invoke<DbCell>("upsert_db_cell", { data });
}
