use crate::db::background_image::{
    add_background_into_db, delete_background_from_db, get_backgrounds_from_db,
    import_background_into_app,
};
use crate::models::background_image::{BackgroundImage, NewBackgroundImage};
use crate::utils::db::AppDb;
use crate::utils::errors::DbResult;

#[tauri::command]
pub fn add_background(
    db: tauri::State<AppDb>,
    data: NewBackgroundImage,
) -> DbResult<BackgroundImage> {
    add_background_into_db(&db, data)
}

#[tauri::command]
pub fn import_background(
    db: tauri::State<AppDb>,
    app_handle: tauri::AppHandle,
    nest_id: i64,
    file_path: String,
) -> DbResult<BackgroundImage> {
    import_background_into_app(app_handle, &db, nest_id, file_path)
}

#[tauri::command]
pub fn get_backgrounds(db: tauri::State<AppDb>, nest_id: i64) -> DbResult<Vec<BackgroundImage>> {
    get_backgrounds_from_db(&db, nest_id)
}

#[tauri::command]
pub fn delete_background(db: tauri::State<AppDb>, id: i64) -> DbResult<()> {
    delete_background_from_db(&db, id)
}
