import { invoke } from "@tauri-apps/api/core";
import {
  NewDbColumn,
  DbColumn,
  NewDbRow,
  DbRow,
  NewDbCell,
  DbCell,
  DbData,
  DbColumnOption,
  NewDbColumnOption,
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
  columnType,
  orderIndex,
}: {
  id: number;
  name: string;
  columnType: string;
  orderIndex: number;
}) {
  await invoke<void>("update_db_column", { id, name, columnType, orderIndex });
}

export async function deleteDbColumn(id: number) {
  await invoke<void>("delete_db_column", { id });
}

export async function clearCellsByColumn(columnId: number) {
  await invoke<void>("clear_cells_by_column", { columnId });
}

export async function createDbRow(data: NewDbRow) {
  return await invoke<DbRow>("create_db_row", { data });
}

export async function deleteDbRow(id: number) {
  await invoke<void>("delete_db_row", { id });
}

export async function insertDbCell(data: NewDbCell) {
  return await invoke<DbCell>("insert_db_cell", { data });
}

export async function createColumnOption(data: NewDbColumnOption) {
  return await invoke<DbColumnOption>("create_column_option", { data });
}

export async function updateColumnOption(
  id: number,
  label: string,
  color: string,
  orderIndex: number,
) {
  await invoke<void>("update_column_option", { id, label, color, orderIndex });
}

export async function deleteColumnOption(optionId: number) {
  await invoke<void>("delete_column_option", { optionId });
}
