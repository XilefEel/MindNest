use crate::{db::folder::{delete_folder_from_db, get_folders_by_nest, insert_folder_into_db, update_folder_in_db}, models::folder::{Folder, NewFolder}, utils::db::AppDb};

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
