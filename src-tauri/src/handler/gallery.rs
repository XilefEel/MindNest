use crate::db::gallery::{
    add_image_into_db, delete_image_from_db, get_image_by_id, get_images_from_db,
    update_image_in_db,
};
use crate::fs::file::{copy_to_app_dir, delete_file, get_dimensions};
use crate::fs::gallery::{copy_to_user_dir, export_images_as_zip, write_image_data};
use crate::models::gallery::GalleryImage;
use crate::models::gallery::NewGalleryImage;
use crate::utils::db::AppDb;
use crate::utils::errors::{AppError, AppResult, LogError};
use std::fs;
use std::path::Path;

#[tauri::command]
pub async fn import_image_from_path(
    app_handle: tauri::AppHandle,
    db: tauri::State<'_, AppDb>,
    nestling_id: i64,
    file_path: String,
) -> AppResult<GalleryImage> {
    let title = Path::new(&file_path)
        .file_stem()
        .map(|s| s.to_string_lossy().to_string());

    let new_path = tauri::async_runtime::spawn_blocking(move || {
        copy_to_app_dir(&app_handle, &file_path, "gallery")
    })
    .await
    .map_err(|e| AppError::ValidationError(e.to_string()))??;

    let (width, height) = get_dimensions(&new_path)?;

    add_image_into_db(
        &db,
        NewGalleryImage {
            nestling_id,
            file_path: new_path,
            title,
            description: None,
            is_favorite: false,
            width,
            height,
        },
    )
}

#[tauri::command]
pub async fn import_image_from_data(
    app_handle: tauri::AppHandle,
    db: tauri::State<'_, AppDb>,
    nestling_id: i64,
    file_name: String,
    file_data: Vec<u8>,
    title: Option<String>,
    description: Option<String>,
    is_favorite: Option<bool>,
) -> AppResult<GalleryImage> {
    let new_path = tauri::async_runtime::spawn_blocking({
        let file_name = file_name.clone();
        move || write_image_data(&app_handle, &file_name, file_data)
    })
    .await
    .map_err(|e| AppError::ValidationError(e.to_string()))??;

    let (width, height) = get_dimensions(&new_path)?;

    add_image_into_db(
        &db,
        NewGalleryImage {
            nestling_id,
            file_path: new_path,
            title: Some(title.unwrap_or(file_name)),
            description,
            is_favorite: is_favorite.unwrap_or(false),
            width,
            height,
        },
    )
}

#[tauri::command]
pub async fn duplicate_image(
    app_handle: tauri::AppHandle,
    db: tauri::State<'_, AppDb>,
    original_image_id: i64,
) -> AppResult<GalleryImage> {
    let original = get_image_by_id(&db, original_image_id)?;

    let file_name = Path::new(&original.file_path)
        .file_name()
        .unwrap()
        .to_string_lossy()
        .to_string();

    let new_path = tauri::async_runtime::spawn_blocking({
        let file_path = original.file_path.clone();
        move || {
            let image_data =
                fs::read(&file_path).log_err("duplicate_image: failed to read image data")?;

            write_image_data(&app_handle, &file_name, image_data)
        }
    })
    .await
    .map_err(|e| AppError::ValidationError(e.to_string()))??;

    let (width, height) = get_dimensions(&new_path)?;

    add_image_into_db(
        &db,
        NewGalleryImage {
            nestling_id: original.nestling_id,
            file_path: new_path,
            title: original.title,
            description: original.description,
            is_favorite: original.is_favorite,
            width,
            height,
        },
    )
}

#[tauri::command]
pub fn get_images(db: tauri::State<AppDb>, nestling_id: i64) -> AppResult<Vec<GalleryImage>> {
    get_images_from_db(&db, nestling_id)
}

#[tauri::command]
pub fn update_image(
    db: tauri::State<AppDb>,
    id: i64,
    title: Option<String>,
    description: Option<String>,
    is_favorite: bool,
) -> AppResult<()> {
    update_image_in_db(&db, id, title, description, is_favorite)
}

#[tauri::command]
pub fn delete_image(db: tauri::State<AppDb>, id: i64) -> AppResult<()> {
    let image = get_image_by_id(&db, id)?;
    delete_file(&image.file_path);
    delete_image_from_db(&db, id)
}

#[tauri::command]
pub async fn download_image(
    db: tauri::State<'_, AppDb>,
    id: i64,
    save_path: String,
) -> AppResult<()> {
    let image = get_image_by_id(&db, id)?;

    tauri::async_runtime::spawn_blocking(move || copy_to_user_dir(&image.file_path, &save_path))
        .await
        .map_err(|e| AppError::ValidationError(e.to_string()))?
}

#[tauri::command]
pub async fn download_all_images(
    db: tauri::State<'_, AppDb>,
    nestling_id: i64,
    save_path: String,
) -> AppResult<()> {
    let images = get_images_from_db(&db, nestling_id)?;
    tauri::async_runtime::spawn_blocking(move || export_images_as_zip(images, &save_path))
        .await
        .map_err(|e| AppError::ValidationError(e.to_string()))?
}
