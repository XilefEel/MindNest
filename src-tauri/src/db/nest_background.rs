use crate::models::nest_background::{BackgroundImage, NewBackgroundImage};
use crate::utils::user::get_connection;

use chrono::Local;
use imagesize::size;
use rusqlite::params;
use std::fs;
use tauri::Manager;

pub fn add_background_into_db(data: NewBackgroundImage) -> Result<BackgroundImage, String> {
    let connection = get_connection().map_err(|e| e.to_string())?;
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

pub fn import_background_data_into_app(
    app_handle: tauri::AppHandle,
    nest_id: i64,
    file_name: String,
    file_data: Vec<u8>,
    is_selected: Option<bool>,
) -> Result<BackgroundImage, String> {
    let app_dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| e.to_string())?;
    
    let images_dir = app_dir.join("backgrounds");
    fs::create_dir_all(&images_dir).map_err(|e| e.to_string())?;

    let timestamp = Local::now().timestamp_millis();
    let new_filename = format!("{}_{}", timestamp, file_name);
    let destination = images_dir.join(&new_filename);
    
    fs::write(&destination, file_data).map_err(|e| e.to_string())?;
    
    let destination_str = destination.to_string_lossy().to_string();
    let (width, height) = get_image_dimensions(&destination_str)?;

    let new_image = NewBackgroundImage {
        nest_id,
        file_path: destination_str,
        is_selected: is_selected.unwrap_or(false),
        width,
        height,
    };

    let saved_image = add_background_into_db(new_image).map_err(|e| e.to_string())?;
    Ok(saved_image)
}

pub fn get_backgrounds_from_db(nest_id: i64) -> Result<Vec<BackgroundImage>, String> {
    let connection = get_connection().map_err(|e| e.to_string())?;

    let mut statement = connection
        .prepare("
        SELECT id, nest_id, file_path, is_selected, width, height, created_at, updated_at 
        FROM nest_background_images 
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

pub fn set_selected_background(nest_id: i64, background_id: i64) -> Result<(), String> {
    let connection = get_connection().map_err(|e| e.to_string())?;
    let updated_at = Local::now()
        .naive_local()
        .format("%Y-%m-%d %H:%M:%S")
        .to_string();

    connection
        .execute(
            "UPDATE nest_background_images SET is_selected = 0, updated_at = ?1 WHERE nest_id = ?2",
            params![updated_at, nest_id],
        )
        .map_err(|e| e.to_string())?;

    let rows_affected = connection
        .execute(
            "UPDATE nest_background_images SET is_selected = 1, updated_at = ?1 WHERE id = ?2 AND nest_id = ?3",
            params![updated_at, background_id, nest_id],
        )
        .map_err(|e| e.to_string())?;

    if rows_affected == 0 {
        return Err("Background not found or doesn't belong to this nest".to_string());
    }

    Ok(())
}

pub fn delete_background_from_db(id: i64) -> Result<(), String> {
    let connection = get_connection().map_err(|e| e.to_string())?;
    connection
        .execute("DELETE FROM background_images WHERE id = ?1", params![id],
        )
        .map_err(|e| e.to_string())?;
    Ok(())
}