use crate::models::nestling::{Nestling, Folder, NewNestling, NewFolder};
use crate::db::nestling::{
    insert_nestling_into_db,
    get_nestlings_by_nest,
    insert_folder_into_db,
    get_folders_by_nest,
    update_nestling_folder,
    update_note
};

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
pub fn edit_note(id: i64, title: Option<String>, content: Option<String>) -> Result<(), String> {
    update_note(id, title, content)
}