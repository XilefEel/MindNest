use crate::db::gallery::{
    add_album_to_db, delete_album_from_db, delete_image_from_app, get_albums_from_db,
    get_images_from_db, add_image_into_db, import_image_into_app, import_image_data_into_app, duplicate_image_from_image, update_album_in_db, update_image_in_db,
    download_image_into_user, download_album_into_user,
};
use crate::models::nestling::{GalleryAlbum, GalleryImage, NewGalleryAlbum, NewGalleryImage};

#[tauri::command]
pub fn add_image(data: NewGalleryImage) -> Result<GalleryImage, String> {
    add_image_into_db(data)
}

#[tauri::command]
pub fn import_image(
    app_handle: tauri::AppHandle,
    nestling_id: i64,
    album_id: Option<i64>,
    file_path: String,
) -> Result<GalleryImage, String> {
    import_image_into_app(app_handle, nestling_id, album_id, file_path)
}

#[tauri::command]
pub fn import_image_data(
    app_handle: tauri::AppHandle,
    nestling_id: i64,
    album_id: Option<i64>,
    file_name: String,
    file_data: Vec<u8>,
    title: Option<String>,
    description: Option<String>,
    is_favorite: Option<bool>,
) -> Result<GalleryImage, String> {
    import_image_data_into_app(app_handle, nestling_id, album_id, file_name, file_data, title, description, is_favorite)
}

#[tauri::command]
pub fn duplicate_image(app_handle: tauri::AppHandle, original_image_id: i64) -> Result<GalleryImage, String> {
    duplicate_image_from_image(app_handle, original_image_id)
}

#[tauri::command]
pub fn get_images(nestling_id: i64) -> Result<Vec<GalleryImage>, String> {
    get_images_from_db(nestling_id)
}

#[tauri::command]
pub fn update_image(
    id: i64,
    album_id: Option<i64>,
    title: Option<String>,
    description: Option<String>,
    is_favorite: bool,
) -> Result<(), String> {
    update_image_in_db(id, album_id, title, description, is_favorite)
}

#[tauri::command]
pub fn download_image(id: i64, save_path: String) -> Result<(), String> {
    download_image_into_user(id, save_path)
}

#[tauri::command]
pub fn download_album(id: i64, save_path: String) -> Result<(), String> {
    download_album_into_user(id, save_path)
}

#[tauri::command]
pub fn delete_image(id: i64) -> Result<(), String> {
    delete_image_from_app(id)
}

#[tauri::command]
pub fn create_album(data: NewGalleryAlbum) -> Result<GalleryAlbum, String> {
    add_album_to_db(data)
}

#[tauri::command]
pub fn get_albums(nestling_id: i64) -> Result<Vec<GalleryAlbum>, String> {
    get_albums_from_db(nestling_id)
}

#[tauri::command]
pub fn update_album(
    id: i64,
    name: Option<String>,
    description: Option<String>,
) -> Result<(), String> {
    update_album_in_db(id, name, description)
}

#[tauri::command]
pub fn delete_album(id: i64) -> Result<(), String> {
    delete_album_from_db(id)
}
