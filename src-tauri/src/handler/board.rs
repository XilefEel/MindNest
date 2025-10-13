use crate::db::board::{
    delete_board_card_from_db, delete_board_column_from_db, get_board_data_from_db,
    insert_board_card_into_db, insert_board_column_into_db, update_board_card_in_db,
    update_board_column_in_db,
};
use crate::models::board::{BoardCard, BoardColumn, BoardData, NewBoardCard, NewBoardColumn};
use crate::utils::db::AppDb;

#[tauri::command]
pub fn create_board_column(db: tauri::State<AppDb>, data: NewBoardColumn) -> Result<BoardColumn, String> {
    insert_board_column_into_db(&db, data)
}

#[tauri::command]
pub fn update_board_column(db: tauri::State<AppDb>, id: i64, title: String, order_index: i64) -> Result<(), String> {
    update_board_column_in_db(&db, id, title, order_index)
}

#[tauri::command]
pub fn delete_board_column(db: tauri::State<AppDb>, id: i64) -> Result<(), String> {
    delete_board_column_from_db(&db, id)
}

#[tauri::command]
pub fn create_board_card(db: tauri::State<AppDb>, data: NewBoardCard) -> Result<BoardCard, String> {
    insert_board_card_into_db(&db, data)
}

#[tauri::command]
pub fn update_board_card(
    db: tauri::State<AppDb>, 
    id: i64,
    title: String,
    description: Option<String>,
    order_index: i64,
    column_id: i64,
) -> Result<(), String> {
    update_board_card_in_db(&db, id, title, description, order_index, column_id)
}

#[tauri::command]
pub fn delete_board_card(db: tauri::State<AppDb>, id: i64) -> Result<(), String> {
    delete_board_card_from_db(&db, id)
}

#[tauri::command]
pub fn get_board_data(db: tauri::State<AppDb>, nestling_id: i64) -> Result<BoardData, String> {
    get_board_data_from_db(&db, nestling_id)
}
