use crate::db::nestling::{
    insert_nestling_into_db, get_nestlings_by_nest, update_nestling_in_db, delete_nestling_from_db,
    insert_folder_into_db, get_folders_by_nest, update_folder_in_db, delete_folder_from_db
};
use crate::models::nestling::{Folder, Nestling, NewFolder, NewNestling};
use crate::utils::db::AppDb;

#[tauri::command]
pub fn create_nestling(db: tauri::State<AppDb>, data: NewNestling) -> Result<Nestling, String> {
    insert_nestling_into_db(&db, data)
}

#[tauri::command]
pub fn get_nestlings(db: tauri::State<AppDb>, nest_id: i32) -> Result<Vec<Nestling>, String> {
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


#[tauri::command]
pub fn create_folder(db: tauri::State<AppDb>, data: NewFolder) -> Result<Folder, String> {
    insert_folder_into_db(&db, data)
}

#[tauri::command]
pub fn get_folders(db: tauri::State<AppDb>, nest_id: i64) -> Result<Vec<Folder>, String> {
    get_folders_by_nest(&db, nest_id)
}

#[tauri::command]
pub fn update_folder(db: tauri::State<AppDb>, id: i64, parent_id: Option<i64>, name: Option<String>) -> Result<(), String> {
    update_folder_in_db(&db, id, parent_id, name)
}

#[tauri::command]
pub fn delete_folder(db: tauri::State<AppDb>, id: i64) -> Result<(), String> {
    delete_folder_from_db(&db, id)
}
