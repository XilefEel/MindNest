use crate::db::background_image::{
    add_background_into_db, delete_background_from_db, get_backgrounds_from_db, import_background_into_app
};
use crate::models::background_image::{BackgroundImage, NewBackgroundImage};
use crate::utils::db::AppDb;

#[tauri::command]
pub fn add_background(db: tauri::State<AppDb>, data: NewBackgroundImage) -> Result<BackgroundImage, String> {
    add_background_into_db(&db, data)
}

#[tauri::command]
pub fn import_background(db: tauri::State<AppDb>, app_handle: tauri::AppHandle, nest_id: i64, file_path: String,) -> Result<BackgroundImage, String> {
    import_background_into_app(app_handle, &db, nest_id, file_path)
}

#[tauri::command]
pub fn get_backgrounds(db: tauri::State<AppDb>, nest_id: i64) -> Result<Vec<BackgroundImage>, String> {
    get_backgrounds_from_db(&db, nest_id)
}

#[tauri::command]
pub fn delete_background(db: tauri::State<AppDb>, id: i64) -> Result<(), String> {
    delete_background_from_db(&db, id)
}