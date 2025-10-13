use crate::models::nest_background::{BackgroundImage, NewBackgroundImage};
use crate::utils::db::AppDb;

use chrono::Local;
use imagesize::size;
use rusqlite::params;
use std::fs;
use std::path::Path;
use tauri::Manager;

pub fn add_background_into_db(db: &AppDb, data: NewBackgroundImage) -> Result<BackgroundImage, String> {
    let connection = db.connection.lock().unwrap();
    let created_at = Local::now()
        .naive_local()
        .format("%Y-%m-%d %H:%M:%S")
        .to_string();

    let mut statement = connection.prepare("
        INSERT INTO background_images (
            nest_id, file_path, is_selected, width, height, created_at, updated_at
        )
        VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)
        RETURNING id, nest_id, file_path, is_selected, width, height, created_at, updated_at
    ").map_err(|e| e.to_string())?;

    let image = statement.query_row(
        params![
            data.nest_id,
            data.file_path,
            data.is_selected,
            data.width,
            data.height,
            created_at,
            created_at
        ],
        |row| {
            Ok(BackgroundImage {
                id: row.get(0)?,
                nest_id: row.get(1)?,
                file_path: row.get(2)?,
                is_selected: row.get(3)?,
                width: row.get(4)?,
                height: row.get(5)?,
                created_at: row.get(6)?,
                updated_at: row.get(7)?,
            })
        },
    ).map_err(|e| e.to_string())?;

    Ok(image)
}

fn get_image_dimensions(path: &str) -> Result<(i64, i64), String> {
    let dim = size(path).map_err(|e| e.to_string())?;
    Ok((dim.width as i64, dim.height as i64))
}

fn copy_background_to_app_dir(
    app_handle: &tauri::AppHandle,
    file_path: String,
) -> Result<String, String> {
    if !Path::new(&file_path).exists() {
        return Err("File does not exist".to_string());
    }

    let app_dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| e.to_string())?;

    let backgrounds_dir = app_dir.join("backgrounds");

    fs::create_dir_all(&backgrounds_dir).map_err(|e| e.to_string())?;

    let filename = Path::new(&file_path)
        .file_name()
        .ok_or("Could not get filename")?
        .to_string_lossy();

    // Add timestamp (milliseconds) to filename to avoid collisions
    let timestamp = Local::now().timestamp_millis();
    let new_filename = format!("{}_{}", timestamp, filename);

    // Create destination path
    let destination = backgrounds_dir.join(&new_filename);
    let destination_str = destination.to_string_lossy().to_string();

    // Copy the file
    fs::copy(file_path, &destination).map_err(|e| format!("Failed to copy file: {}", e))?;

    Ok(destination_str)
}

pub fn import_background_into_app(
    app_handle: tauri::AppHandle,
    db: &AppDb, 
    nest_id: i64,
    file_path: String,
) -> Result<BackgroundImage, String> {
    let new_path = copy_background_to_app_dir(&app_handle, file_path.clone())?;
    let (width, height) = get_image_dimensions(&new_path).map_err(|e| e.to_string())?;

    let new_background = NewBackgroundImage {
        nest_id,
        file_path: new_path,
        is_selected: false,
        width,
        height,
    };

    let saved_background = add_background_into_db(&db, new_background).map_err(|e| e.to_string())?;
    Ok(saved_background)
}

pub fn get_backgrounds_from_db(db: &AppDb, nest_id: i64) -> Result<Vec<BackgroundImage>, String> {
    let connection = db.connection.lock().unwrap();

    let mut statement = connection
        .prepare("
        SELECT id, nest_id, file_path, is_selected, width, height, created_at, updated_at 
        FROM background_images 
        WHERE nest_id = ?1 
        ORDER BY created_at DESC",
        )
        .map_err(|e| e.to_string())?;

    let rows = statement
        .query_map([nest_id], |row| {
            Ok(BackgroundImage {
                id: row.get(0)?,
                nest_id: row.get(1)?,
                file_path: row.get(2)?,
                is_selected: row.get(3)?,
                width: row.get(4)?,
                height: row.get(5)?,
                created_at: row.get(6)?,
                updated_at: row.get(7)?,
            })
        })
        .map_err(|e| e.to_string())?;

    let result = rows
        .collect::<Result<Vec<BackgroundImage>, _>>()
        .map_err(|e| e.to_string())?;
    Ok(result)
}

fn get_background_by_id(db: &AppDb, id: i64) -> Result<BackgroundImage, String> {
    let connection = db.connection.lock().unwrap();

    let mut statement = connection
        .prepare("
        SELECT id, nest_id, file_path, is_selected, width, height, created_at, updated_at 
        FROM background_images 
        WHERE id = ?1",
        )
        .map_err(|e| e.to_string())?;

    let image = statement
        .query_row([id], |row| {
            Ok(BackgroundImage {
                id: row.get(0)?,
                nest_id: row.get(1)?,
                file_path: row.get(2)?,
                is_selected: row.get(3)?,
                width: row.get(4)?,
                height: row.get(5)?,
                created_at: row.get(6)?,
                updated_at: row.get(7)?,
            })
        })
        .map_err(|e| e.to_string())?;

    Ok(image)
}

pub fn delete_background_from_db(db: &AppDb, id: i64) -> Result<(), String> {

    let background_image = get_background_by_id(&db, id).map_err(|e| e.to_string())?;

    if let Err(err) = fs::remove_file(&background_image.file_path) {
        if err.kind() != std::io::ErrorKind::NotFound {
            return Err(format!("Failed to delete file: {}", err));
        }
    }

    let connection = db.connection.lock().unwrap();
    connection
        .execute("DELETE FROM background_images WHERE id = ?1", params![id],
        )
        .map_err(|e| e.to_string())?;
    Ok(())
}