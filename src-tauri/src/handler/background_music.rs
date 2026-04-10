use crate::db::background_music::{
    add_music_into_db, delete_music_from_db, get_music_by_id, get_music_from_db, update_music_in_db,
};
use crate::fs::background_music::extract_metadata;
use crate::fs::file::{copy_to_app_dir, delete_file};
use crate::models::background_music::{BackgroundMusic, NewBackgroundMusic};
use crate::utils::db::AppDb;
use crate::utils::errors::{AppError, AppResult};

#[tauri::command]
pub async fn import_music(
    db: tauri::State<'_, AppDb>,
    app_handle: tauri::AppHandle,
    nest_id: i64,
    file_path: String,
    order_index: i64,
) -> AppResult<BackgroundMusic> {
    let (title, duration_seconds) = extract_metadata(&file_path)?;

    let new_path = tauri::async_runtime::spawn_blocking({
        move || copy_to_app_dir(&app_handle, &file_path, "music")
    })
    .await
    .map_err(|e| AppError::ValidationError(e.to_string()))??;

    let new_music = NewBackgroundMusic {
        nest_id,
        title,
        file_path: new_path,
        duration_seconds,
        order_index,
    };

    add_music_into_db(&db, new_music)
}

#[tauri::command]
pub fn get_music(db: tauri::State<AppDb>, nest_id: i64) -> AppResult<Vec<BackgroundMusic>> {
    get_music_from_db(&db, nest_id)
}

#[tauri::command]
pub fn update_music(
    db: tauri::State<AppDb>,
    id: i64,
    title: String,
    order_index: i64,
) -> AppResult<()> {
    update_music_in_db(&db, id, title, order_index)
}

#[tauri::command]
pub fn delete_music(db: tauri::State<AppDb>, id: i64) -> AppResult<()> {
    let music = get_music_by_id(&db, id)?;
    delete_file(&music.file_path);
    delete_music_from_db(&db, id)
}
