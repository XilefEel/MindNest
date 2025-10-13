use crate::db::nestling::{
    insert_nestling_into_db, get_nestlings_by_nest, update_nestling_in_db, delete_nestling_from_db,
};
use crate::models::nestling::{Nestling, NewNestling};
use crate::utils::db::AppDb;

#[tauri::command]
pub fn create_nestling(db: tauri::State<AppDb>, data: NewNestling) -> Result<Nestling, String> {
    insert_nestling_into_db(&db, data)
}

#[tauri::command]
pub fn get_nestlings(db: tauri::State<AppDb>, nest_id: i64) -> Result<Vec<Nestling>, String> {
    get_nestlings_by_nest(&db, nest_id)
}

#[tauri::command]
pub fn update_nestling(db: tauri::State<AppDb>, id: i64, folder_id: Option<i64>, title: Option<String>, content: Option<String>) -> Result<(), String> {
    update_nestling_in_db(&db, id, folder_id, title, content)
}

#[tauri::command]
pub fn delete_nestling(db: tauri::State<AppDb>, id: i64) -> Result<(), String> {
    delete_nestling_from_db(&db, id)
}