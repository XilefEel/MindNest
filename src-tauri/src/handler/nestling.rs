use crate::models::nestling::{Folder, Nestling, NewFolder, NewNestling};
use crate::db::nestling::{get_folders_by_nest, get_nestlings_by_nest, insert_folder_into_db, insert_nestling_into_db, update_nestling_folder, delete_nestling_from_db, delete_folder_from_db};

#[tauri::command]
pub fn create_nestling(data: NewNestling) -> Result<(), String> {
    insert_nestling_into_db(data)
}

#[tauri::command]
pub fn get_nestlings(nest_id: i32) -> Result<Vec<Nestling>, String> {
    get_nestlings_by_nest(nest_id)
}

#[tauri::command]
pub fn create_folder(data: NewFolder) -> Result<(), String> {
    insert_folder_into_db(data)
}

#[tauri::command]
pub fn get_folders(nest_id: i32) -> Result<Vec<Folder>, String> {
    get_folders_by_nest(nest_id)
}

#[tauri::command]
pub fn update_folder(id: i64, folder_id: Option<i64>) -> Result<(), String> {
    update_nestling_folder(id, folder_id)
}

#[tauri::command]
pub fn delete_nestling(id: i64) -> Result<(), String> {
    delete_nestling_from_db(id)
}

#[tauri::command]
pub fn delete_folder(id: i64) -> Result<(), String> {
    delete_folder_from_db(id)
}
