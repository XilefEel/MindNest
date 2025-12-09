use crate::db::background_music::{
    add_music_into_db, import_music_into_app, get_music_from_db,
    update_music_in_db,update_music_selection_in_db, delete_music_from_db
};
use crate::models::background_music::{NewBackgroundMusic, BackgroundMusic};
use crate::utils::db::AppDb;

#[tauri::command]
pub fn add_music(db: tauri::State<AppDb>, data: NewBackgroundMusic) -> Result<BackgroundMusic, String> {
    add_music_into_db(&db, data)
}

#[tauri::command]
pub fn import_music(
    db: tauri::State<AppDb>,
    app_handle: tauri::AppHandle,
    nest_id: i64,
    file_path: String,
    title: String,
    duration_seconds: i64,
    order_index: i64,
) -> Result<BackgroundMusic, String> {
    import_music_into_app(app_handle, &db, nest_id, file_path, title, duration_seconds, order_index)
}

#[tauri::command]
pub fn get_music(db: tauri::State<AppDb>, nest_id: i64) -> Result<Vec<BackgroundMusic>, String> {
    get_music_from_db(&db, nest_id)
}

#[tauri::command]
pub fn update_music(db: tauri::State<AppDb>, id: i64, title: String, order_index: i64) -> Result<(), String> {
    update_music_in_db(&db, id, title, order_index)
}

#[tauri::command]
pub fn update_music_selection(db: tauri::State<AppDb>, nest_id: i64, music_id: i64) -> Result<(), String> {
    update_music_selection_in_db(&db, nest_id, music_id)
}

#[tauri::command]
pub fn delete_music(db: tauri::State<AppDb>, id: i64) -> Result<(), String> {
    delete_music_from_db(&db, id)
}