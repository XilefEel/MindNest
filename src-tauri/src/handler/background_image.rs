use crate::db::background_image::{
    add_background_into_db, delete_background_from_db, get_background_by_id,
    get_backgrounds_from_db,
};
use crate::fs::file::{copy_to_app_dir, delete_file, get_dimensions};
use crate::models::background_image::{BackgroundImage, NewBackgroundImage};
use crate::utils::db::AppDb;
use crate::utils::errors::AppResult;

#[tauri::command]
pub fn import_background(
    db: tauri::State<AppDb>,
    app_handle: tauri::AppHandle,
    nest_id: i64,
    file_path: String,
) -> AppResult<BackgroundImage> {
    let new_path = copy_to_app_dir(&app_handle, &file_path, "backgrounds")?;
    let (width, height) = get_dimensions(&new_path)?;

    let new_background = NewBackgroundImage {
        nest_id,
        file_path: new_path,
        is_selected: false,
        width,
        height,
    };

    add_background_into_db(&db, new_background)
}

#[tauri::command]
pub fn get_backgrounds(db: tauri::State<AppDb>, nest_id: i64) -> AppResult<Vec<BackgroundImage>> {
    get_backgrounds_from_db(&db, nest_id)
}

#[tauri::command]
pub fn delete_background(db: tauri::State<AppDb>, id: i64) -> AppResult<()> {
    let image = get_background_by_id(&db, id)?;
    delete_file(&image.file_path);
    delete_background_from_db(&db, id)
}
