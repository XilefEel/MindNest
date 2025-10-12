use crate::db::nestling::{
    insert_nestling_into_db, get_nestlings_by_nest, update_nestling_in_db, delete_nestling_from_db,
    insert_folder_into_db, get_folders_by_nest, update_folder_in_db, delete_folder_from_db
};
use crate::models::nestling::{Folder, Nestling, NewFolder, NewNestling};

#[tauri::command]
pub fn create_nestling(data: NewNestling) -> Result<Nestling, String> {
    insert_nestling_into_db(data)
}

#[tauri::command]
pub fn get_nestlings(nest_id: i32) -> Result<Vec<Nestling>, String> {
    get_nestlings_by_nest(nest_id)
}

#[tauri::command]
pub fn update_nestling(id: i64, folder_id: Option<i64>, title: Option<String>, content: Option<String>) -> Result<(), String> {
    update_nestling_in_db(id, folder_id, title, content)
}

#[tauri::command]
pub fn delete_nestling(id: i64) -> Result<(), String> {
    delete_nestling_from_db(id)
}


#[tauri::command]
pub fn create_folder(data: NewFolder) -> Result<Folder, String> {
    insert_folder_into_db(data)
}

#[tauri::command]
pub fn get_folders(nest_id: i32) -> Result<Vec<Folder>, String> {
    get_folders_by_nest(nest_id)
}

#[tauri::command]
pub fn update_folder(id: i64, parent_id: Option<i64>, name: Option<String>) -> Result<(), String> {
    println!("update_folder called: id={} parent_id={:?} name={:?}", id, parent_id, name);
    update_folder_in_db(id, parent_id, name)
}

#[tauri::command]
pub fn delete_folder(id: i64) -> Result<(), String> {
    delete_folder_from_db(id)
}
