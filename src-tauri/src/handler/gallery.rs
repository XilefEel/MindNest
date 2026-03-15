use crate::db::gallery::{
    add_image_into_db, delete_image_from_db, get_image_by_id, get_images_from_db,
    update_image_in_db,
};
use crate::fs::file::{copy_to_app_dir, delete_file, get_dimensions};
use crate::fs::gallery::{copy_to_user_dir, export_images_as_zip, write_image_data};
use crate::models::gallery::GalleryImage;
use crate::models::gallery::NewGalleryImage;
use crate::utils::db::AppDb;
use crate::utils::errors::{DbResult, LogError};
use std::fs;
use std::path::Path;

#[tauri::command]
pub fn import_image_from_path(
    app_handle: tauri::AppHandle,
    db: tauri::State<AppDb>,
    nestling_id: i64,
    album_id: Option<i64>,
    file_path: String,
) -> DbResult<GalleryImage> {
    let title = Path::new(&file_path)
        .file_stem()
        .map(|s| s.to_string_lossy().to_string());

    let new_path = copy_to_app_dir(&app_handle, &file_path, "gallery")?;
    let (width, height) = get_dimensions(&new_path)?;

    add_image_into_db(
        &db,
        NewGalleryImage {
            album_id,
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
pub fn import_image_from_data(
    app_handle: tauri::AppHandle,
    db: tauri::State<AppDb>,
    nestling_id: i64,
    album_id: Option<i64>,
    file_name: String,
    file_data: Vec<u8>,
    title: Option<String>,
    description: Option<String>,
    is_favorite: Option<bool>,
) -> DbResult<GalleryImage> {
    let new_path = write_image_data(&app_handle, &file_name, file_data)?;
    let (width, height) = get_dimensions(&new_path)?;

    add_image_into_db(
        &db,
        NewGalleryImage {
            album_id,
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
pub fn duplicate_image(
    app_handle: tauri::AppHandle,
    db: tauri::State<AppDb>,
    original_image_id: i64,
) -> DbResult<GalleryImage> {
    let original = get_image_by_id(&db, original_image_id)?;
    let image_data =
        fs::read(&original.file_path).log_err("duplicate_image: failed to read image data")?;

    let file_name = Path::new(&original.file_path)
        .file_name()
        .unwrap()
        .to_string_lossy()
        .to_string();

    let new_path = write_image_data(&app_handle, &file_name, image_data)?;
    let (width, height) = get_dimensions(&new_path)?;

    add_image_into_db(
        &db,
        NewGalleryImage {
            album_id: original.album_id,
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
pub fn get_images(db: tauri::State<AppDb>, nestling_id: i64) -> DbResult<Vec<GalleryImage>> {
    get_images_from_db(&db, nestling_id)
}

#[tauri::command]
pub fn update_image(
    db: tauri::State<AppDb>,
    id: i64,
    album_id: Option<i64>,
    title: Option<String>,
    description: Option<String>,
    is_favorite: bool,
) -> DbResult<()> {
    update_image_in_db(&db, id, album_id, title, description, is_favorite)
}

#[tauri::command]
pub fn delete_image(db: tauri::State<AppDb>, id: i64) -> DbResult<()> {
    let image = get_image_by_id(&db, id)?;
    delete_file(&image.file_path);
    delete_image_from_db(&db, id)
}

#[tauri::command]
pub fn download_image(db: tauri::State<AppDb>, id: i64, save_path: String) -> DbResult<()> {
    let image = get_image_by_id(&db, id)?;
    copy_to_user_dir(&image.file_path, &save_path)
}

#[tauri::command]
pub fn download_all_images(
    db: tauri::State<AppDb>,
    nestling_id: i64,
    save_path: String,
) -> DbResult<()> {
    let images = get_images_from_db(&db, nestling_id)?;
    export_images_as_zip(images, &save_path)
}

// #[tauri::command]
// pub fn create_album(db: tauri::State<AppDb>, data: NewGalleryAlbum) -> DbResult<GalleryAlbum> {
//     add_album_to_db(&db, data)
// }

// #[tauri::command]
// pub fn get_albums(db: tauri::State<AppDb>, nestling_id: i64) -> DbResult<Vec<GalleryAlbum>> {
//     get_albums_from_db(&db, nestling_id)
// }

// #[tauri::command]
// pub fn update_album(
//     db: tauri::State<AppDb>,
//     id: i64,
//     name: Option<String>,
//     description: Option<String>,
// ) -> DbResult<()> {
//     update_album_in_db(&db, id, name, description)
// }

// #[tauri::command]
// pub fn delete_album(db: tauri::State<AppDb>, id: i64) -> DbResult<()> {
//     delete_album_from_db(&db, id)
// }
