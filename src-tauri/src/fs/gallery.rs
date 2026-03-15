use crate::models::gallery::GalleryImage;
use crate::utils::errors::{DbError, DbResult, LogError};
use chrono::Local;
use std::fs;
use std::io::Write;
use std::path::Path;
use tauri::Manager;
use zip::ZipWriter;

pub fn write_image_data(
    app_handle: &tauri::AppHandle,
    file_name: &str,
    file_data: Vec<u8>,
) -> DbResult<String> {
    let app_dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| DbError::ValidationError(e.to_string()))?;

    let images_dir = app_dir.join("gallery");

    fs::create_dir_all(&images_dir)
        .log_err("write_image_data: failed to create images directory")?;

    let timestamp = Local::now().timestamp_millis();
    let new_filename = format!("{}_{}", timestamp, file_name);
    let destination = images_dir.join(&new_filename);

    fs::write(&destination, file_data).log_err("write_image_data: failed to write image data")?;

    Ok(destination.to_string_lossy().to_string())
}

pub fn copy_to_user_dir(file_path: &str, save_path: &str) -> DbResult<()> {
    fs::copy(file_path, save_path).log_err("copy_to_user_dir: failed to copy image")?;
    Ok(())
}

pub fn export_images_as_zip(images: Vec<GalleryImage>, save_path: &str) -> DbResult<()> {
    let file =
        fs::File::create(save_path).log_err("export_images_as_zip: failed to create zip file")?;

    let mut zip = ZipWriter::new(file);

    for image in images {
        if !Path::new(&image.file_path).exists() {
            continue;
        }

        let filename = if let Some(title) = &image.title {
            let ext = Path::new(&image.file_path)
                .extension()
                .map(|e| format!(".{}", e.to_string_lossy()))
                .unwrap_or_default();
            format!("{}{}", title, ext)
        } else {
            Path::new(&image.file_path)
                .file_name()
                .unwrap()
                .to_string_lossy()
                .to_string()
        };

        zip.start_file(&filename, zip::write::FileOptions::<()>::default())
            .log_err("export_images_as_zip: failed to start zip entry")?;

        let image_data = fs::read(&image.file_path)
            .log_err("export_images_as_zip: failed to read image data")?;

        zip.write_all(&image_data)
            .log_err("export_images_as_zip: failed to write image data")?;
    }

    zip.finish()
        .log_err("export_images_as_zip: failed to finish zip")?;

    Ok(())
}
