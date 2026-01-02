use crate::db::nestling::{
    delete_nestling_from_db, get_nestlings_by_nest, insert_nestling_into_db, update_nestling_in_db,
    update_nestling_timestamp_in_db,
};
use crate::models::nestling::{Nestling, NewNestling};
use crate::utils::db::AppDb;
use crate::utils::errors::DbResult;

#[tauri::command]
pub fn create_nestling(db: tauri::State<AppDb>, data: NewNestling) -> DbResult<Nestling> {
    insert_nestling_into_db(&db, data)
}

#[tauri::command]
pub fn get_nestlings(db: tauri::State<AppDb>, nest_id: i64) -> DbResult<Vec<Nestling>> {
    get_nestlings_by_nest(&db, nest_id)
}

#[tauri::command]
pub fn update_nestling(
    db: tauri::State<AppDb>,
    id: i64,
    folder_id: Option<i64>,
    icon: Option<String>,
    is_pinned: Option<bool>,
    title: Option<String>,
    content: Option<String>,
) -> DbResult<()> {
    update_nestling_in_db(&db, id, folder_id, icon, is_pinned, title, content)
}

#[tauri::command]
pub fn update_nestling_timestamp(db: tauri::State<AppDb>, id: i64) -> DbResult<()> {
    update_nestling_timestamp_in_db(&db, id)
}

#[tauri::command]
pub fn delete_nestling(db: tauri::State<AppDb>, id: i64) -> DbResult<()> {
    delete_nestling_from_db(&db, id)
}
