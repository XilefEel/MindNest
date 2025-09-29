use crate::db::nest_background::{
    add_background_into_db, delete_background_from_db, get_backgrounds_from_db, import_background_into_app
};
use crate::models::nest_background::{BackgroundImage, NewBackgroundImage};

#[tauri::command]
pub fn add_background(data: NewBackgroundImage) -> Result<BackgroundImage, String> {
    add_background_into_db(data)
}

#[tauri::command]
pub fn import_background(app_handle: tauri::AppHandle, nest_id: i64, file_path: String,) -> Result<BackgroundImage, String> {
    import_background_into_app(app_handle, nest_id, file_path)
}

#[tauri::command]
pub fn get_backgrounds(nest_id: i64) -> Result<Vec<BackgroundImage>, String> {
    get_backgrounds_from_db(nest_id)
}

#[tauri::command]
pub fn delete_background(id: i64) -> Result<(), String> {
    delete_background_from_db(id)
}