use crate::models::background_image::{BackgroundImage, NewBackgroundImage};
use crate::utils::db::AppDb;
use crate::utils::errors::{DbError, DbResult, LogError};

use chrono::{Local, Utc};
use imagesize::size;
use rusqlite::params;
use std::fs;
use std::path::Path;
use tauri::Manager;

pub fn add_background_into_db(db: &AppDb, data: NewBackgroundImage) -> DbResult<BackgroundImage> {
    let connection = db.connection.lock().unwrap();
    let created_at = Utc::now().to_rfc3339();

    let mut statement = connection
        .prepare("
            INSERT INTO background_images (nest_id, file_path, is_selected, width, height, created_at, updated_at)
            VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)
            RETURNING id, nest_id, file_path, is_selected, width, height, created_at, updated_at"
        )?;

    let image = statement
        .query_row(
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
        )
        .log_err("get_background_by_id")?;

    Ok(image)
}

fn get_image_dimensions(path: &str) -> DbResult<(i64, i64)> {
    let dim = size(path).log_err("get_image_dimensions")?;
    Ok((dim.width as i64, dim.height as i64))
}

fn copy_background_to_app_dir(
    app_handle: &tauri::AppHandle,
    file_path: String,
) -> DbResult<String> {
    if !Path::new(&file_path).exists() {
        return Err(DbError::NotFound);
    }

    let app_dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| DbError::ValidationError(e.to_string()))?;

    let backgrounds_dir = app_dir.join("backgrounds");

    fs::create_dir_all(&backgrounds_dir)
        .log_err("copy_background_to_app_dir: failed to create backgrounds dir")?;

    let filename = Path::new(&file_path)
        .file_name()
        .ok_or_else(|| DbError::ValidationError("Could not get filename".to_string()))?;

    let timestamp = Local::now().timestamp_millis();
    let new_filename = format!("{}_{}", timestamp, filename.to_string_lossy());
    let destination = backgrounds_dir.join(&new_filename);
    let destination_str = destination.to_string_lossy().to_string();

    fs::copy(&file_path, &destination).log_err(&format!(
        "copy_background_to_app_dir: failed to copy {} to {}",
        file_path, destination_str
    ))?;

    Ok(destination_str)
}

pub fn import_background_into_app(
    app_handle: tauri::AppHandle,
    db: &AppDb,
    nest_id: i64,
    file_path: String,
) -> DbResult<BackgroundImage> {
    let new_path = copy_background_to_app_dir(&app_handle, file_path)?;
    let (width, height) = get_image_dimensions(&new_path)?;

    let new_background = NewBackgroundImage {
        nest_id,
        file_path: new_path,
        is_selected: false,
        width,
        height,
    };

    let saved_background = add_background_into_db(&db, new_background)?;

    Ok(saved_background)
}

pub fn get_backgrounds_from_db(db: &AppDb, nest_id: i64) -> DbResult<Vec<BackgroundImage>> {
    let connection = db.connection.lock().unwrap();

    let mut statement = connection.prepare(
        "
            SELECT id, nest_id, file_path, is_selected, width, height, created_at, updated_at 
            FROM background_images 
            WHERE nest_id = ?1 
            ORDER BY created_at DESC",
    )?;

    let images = statement
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
        .log_err("get_backgrounds_from_db")?
        .collect::<Result<Vec<_>, _>>()?;

    Ok(images)
}

fn get_background_by_id(db: &AppDb, id: i64) -> DbResult<BackgroundImage> {
    let connection = db.connection.lock().unwrap();

    let mut statement = connection.prepare(
        "
            SELECT id, nest_id, file_path, is_selected, width, height, created_at, updated_at 
            FROM background_images 
            WHERE id = ?1",
    )?;

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
        .log_err("get_background_by_id")?;

    Ok(image)
}

pub fn delete_background_from_db(db: &AppDb, id: i64) -> DbResult<()> {
    let background_image = get_background_by_id(&db, id)?;

    let _ = fs::remove_file(&background_image.file_path);

    let connection = db.connection.lock().unwrap();

    connection
        .execute("DELETE FROM background_images WHERE id = ?1", params![id])
        .log_err("delete_background_from_db")?;

    Ok(())
}
