use crate::db::background_music::{
    add_music_into_db, delete_music_from_db, get_music_from_db, import_music_into_app,
    update_music_in_db,
};
use crate::models::background_music::{BackgroundMusic, NewBackgroundMusic};
use crate::utils::db::AppDb;
use crate::utils::errors::DbResult;

#[tauri::command]
pub fn add_music(db: tauri::State<AppDb>, data: NewBackgroundMusic) -> DbResult<BackgroundMusic> {
    add_music_into_db(&db, data)
}

#[tauri::command]
pub fn import_music(
    db: tauri::State<AppDb>,
    app_handle: tauri::AppHandle,
    nest_id: i64,
    file_path: String,
    order_index: i64,
) -> DbResult<BackgroundMusic> {
    import_music_into_app(app_handle, &db, nest_id, file_path, order_index)
}

#[tauri::command]
pub fn get_music(db: tauri::State<AppDb>, nest_id: i64) -> DbResult<Vec<BackgroundMusic>> {
    get_music_from_db(&db, nest_id)
}

#[tauri::command]
pub fn update_music(
    db: tauri::State<AppDb>,
    id: i64,
    title: String,
    order_index: i64,
) -> DbResult<()> {
    update_music_in_db(&db, id, title, order_index)
}

#[tauri::command]
pub fn delete_music(db: tauri::State<AppDb>, id: i64) -> DbResult<()> {
    delete_music_from_db(&db, id)
}
