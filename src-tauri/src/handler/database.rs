use crate::db::database::{
    delete_db_column_from_db, delete_db_row_from_db, get_db_data_from_db, insert_db_cell_in_db,
    insert_db_column_into_db, insert_db_row_into_db, update_db_column_in_db,
};
use crate::models::database::{DbCell, DbColumn, DbData, DbRow, NewDbCell, NewDbColumn, NewDbRow};
use crate::utils::db::AppDb;
use crate::utils::errors::AppResult;

#[tauri::command]
pub fn create_db_column(db: tauri::State<AppDb>, data: NewDbColumn) -> AppResult<DbColumn> {
    insert_db_column_into_db(&db, data)
}

#[tauri::command]
pub fn update_db_column(
    db: tauri::State<AppDb>,
    id: i64,
    name: String,
    order_index: i64,
) -> AppResult<()> {
    update_db_column_in_db(&db, id, name, order_index)
}

#[tauri::command]
pub fn delete_db_column(db: tauri::State<AppDb>, id: i64) -> AppResult<()> {
    delete_db_column_from_db(&db, id)
}

#[tauri::command]
pub fn create_db_row(db: tauri::State<AppDb>, data: NewDbRow) -> AppResult<DbRow> {
    insert_db_row_into_db(&db, data)
}

#[tauri::command]
pub fn delete_db_row(db: tauri::State<AppDb>, id: i64) -> AppResult<()> {
    delete_db_row_from_db(&db, id)
}

#[tauri::command]
pub fn insert_db_cell(db: tauri::State<AppDb>, data: NewDbCell) -> AppResult<DbCell> {
    insert_db_cell_in_db(&db, data)
}

#[tauri::command]
pub fn get_db_data(db: tauri::State<AppDb>, nestling_id: i64) -> AppResult<DbData> {
    get_db_data_from_db(&db, nestling_id)
}
