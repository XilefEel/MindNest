use crate::utils::errors::{AppError, AppResult, LogError};
use chrono::Local;
use imagesize::size;
use std::{fs, path::Path};
use tauri::Manager;

pub fn get_dimensions(path: &str) -> AppResult<(i64, i64)> {
    let dim = size(path).log_err("get_dimensions")?;
    Ok((dim.width as i64, dim.height as i64))
}

pub fn copy_to_app_dir(
    app_handle: &tauri::AppHandle,
    file_path: &str,
    subfolder: &str,
) -> AppResult<String> {
    if !Path::new(file_path).exists() {
        return Err(AppError::NotFound);
    }

    let app_dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| AppError::ValidationError(e.to_string()))?;

    let destination_dir = app_dir.join(subfolder);

    fs::create_dir_all(&destination_dir).log_err(&format!(
        "copy_to_app_dir: failed to create {} dir",
        subfolder
    ))?;

    let filename = Path::new(file_path)
        .file_name()
        .ok_or_else(|| AppError::ValidationError("Could not get filename".to_string()))?;

    let timestamp = Local::now().timestamp_millis();
    let new_filename = format!("{}_{}", timestamp, filename.to_string_lossy());
    let destination = destination_dir.join(&new_filename);
    let destination_str = destination.to_string_lossy().to_string();

    fs::copy(file_path, &destination).log_err(&format!(
        "copy_to_app_dir: failed to copy {} to {}",
        file_path, destination_str
    ))?;

    Ok(destination_str)
}

pub fn delete_file(file_path: &str) {
    let _ = fs::remove_file(file_path);
}
