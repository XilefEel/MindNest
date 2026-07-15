use crate::db::database::{
    clear_cells_by_column_from_db, delete_db_column_from_db, delete_db_row_from_db,
    delete_db_select_option_from_db, duplicate_db_row_into_db, get_db_data_from_db,
    insert_db_cell_in_db, insert_db_column_into_db, insert_db_row_into_db,
    insert_db_select_option_into_db, update_db_column_in_db, update_db_row_order_in_db,
    update_db_select_option_in_db,
};
use crate::models::database::{
    DbCell, DbColumn, DbData, DbRow, DbRowData, DbSelectOption, NewDbCell, NewDbColumn, NewDbRow,
    NewDbSelectOption,
};
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
    column_type: String,
    order_index: i64,
) -> AppResult<()> {
    update_db_column_in_db(&db, id, name, column_type, order_index)
}

#[tauri::command]
pub fn delete_db_column(db: tauri::State<AppDb>, id: i64) -> AppResult<()> {
    delete_db_column_from_db(&db, id)
}

#[tauri::command]
pub fn clear_cells_by_column(db: tauri::State<AppDb>, column_id: i64) -> AppResult<()> {
    clear_cells_by_column_from_db(&db, column_id)
}

#[tauri::command]
pub fn create_db_row(db: tauri::State<AppDb>, data: NewDbRow) -> AppResult<DbRow> {
    insert_db_row_into_db(&db, data)
}

#[tauri::command]
pub fn duplicate_db_row(db: tauri::State<AppDb>, id: i64) -> AppResult<DbRowData> {
    duplicate_db_row_into_db(&db, id)
}

#[tauri::command]
pub fn delete_db_row(db: tauri::State<AppDb>, id: i64) -> AppResult<()> {
    delete_db_row_from_db(&db, id)
}

#[tauri::command]
pub fn update_row_order(db: tauri::State<AppDb>, id: i64, order_index: i64) -> AppResult<()> {
    update_db_row_order_in_db(&db, id, order_index)
}

#[tauri::command]
pub fn insert_db_cell(db: tauri::State<AppDb>, data: NewDbCell) -> AppResult<DbCell> {
    insert_db_cell_in_db(&db, data)
}

#[tauri::command]
pub fn get_db_data(db: tauri::State<AppDb>, nestling_id: i64) -> AppResult<DbData> {
    get_db_data_from_db(&db, nestling_id)
}

#[tauri::command]
pub fn create_select_option(
    db: tauri::State<AppDb>,
    data: NewDbSelectOption,
) -> AppResult<DbSelectOption> {
    insert_db_select_option_into_db(&db, data)
}

#[tauri::command]
pub fn update_select_option(
    db: tauri::State<AppDb>,
    id: i64,
    label: String,
    color: String,
    order_index: i64,
) -> AppResult<()> {
    update_db_select_option_in_db(&db, id, label, color, order_index)
}

#[tauri::command]
pub fn delete_select_option(db: tauri::State<AppDb>, option_id: i64) -> AppResult<()> {
    delete_db_select_option_from_db(&db, option_id)
}
