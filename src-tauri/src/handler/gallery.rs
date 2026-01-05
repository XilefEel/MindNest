use crate::db::gallery::{
    add_album_to_db, add_image_into_db, delete_album_from_db, delete_image_from_app,
    download_album_into_user, download_image_into_user, duplicate_image_from_image,
    get_albums_from_db, get_images_from_db, import_image_data_into_app, import_image_into_app,
    update_album_in_db, update_image_in_db,
};
use crate::models::gallery::{GalleryAlbum, GalleryImage, NewGalleryAlbum, NewGalleryImage};
use crate::utils::db::AppDb;
use crate::utils::errors::DbResult;

#[tauri::command]
pub fn add_image(db: tauri::State<AppDb>, data: NewGalleryImage) -> DbResult<GalleryImage> {
    add_image_into_db(&db, data)
}

#[tauri::command]
pub fn import_image(
    app_handle: tauri::AppHandle,
    db: tauri::State<AppDb>,
    nestling_id: i64,
    album_id: Option<i64>,
    file_path: String,
) -> DbResult<GalleryImage> {
    import_image_into_app(app_handle, &db, nestling_id, album_id, file_path)
}

#[tauri::command]
pub fn import_image_data(
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
    import_image_data_into_app(
        app_handle,
        &db,
        nestling_id,
        album_id,
        file_name,
        file_data,
        title,
        description,
        is_favorite,
    )
}

#[tauri::command]
pub fn duplicate_image(
    app_handle: tauri::AppHandle,
    db: tauri::State<AppDb>,
    original_image_id: i64,
) -> DbResult<GalleryImage> {
    duplicate_image_from_image(&db, app_handle, original_image_id)
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
pub fn download_image(db: tauri::State<AppDb>, id: i64, save_path: String) -> DbResult<()> {
    download_image_into_user(&db, id, save_path)
}

#[tauri::command]
pub fn download_album(db: tauri::State<AppDb>, id: i64, save_path: String) -> DbResult<()> {
    download_album_into_user(&db, id, save_path)
}

#[tauri::command]
pub fn delete_image(db: tauri::State<AppDb>, id: i64) -> DbResult<()> {
    delete_image_from_app(&db, id)
}

#[tauri::command]
pub fn create_album(db: tauri::State<AppDb>, data: NewGalleryAlbum) -> DbResult<GalleryAlbum> {
    add_album_to_db(&db, data)
}

#[tauri::command]
pub fn get_albums(db: tauri::State<AppDb>, nestling_id: i64) -> DbResult<Vec<GalleryAlbum>> {
    get_albums_from_db(&db, nestling_id)
}

#[tauri::command]
pub fn update_album(
    db: tauri::State<AppDb>,
    id: i64,
    name: Option<String>,
    description: Option<String>,
) -> DbResult<()> {
    update_album_in_db(&db, id, name, description)
}

#[tauri::command]
pub fn delete_album(db: tauri::State<AppDb>, id: i64) -> DbResult<()> {
    delete_album_from_db(&db, id)
}
