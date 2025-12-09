use crate::models::background_music::{BackgroundMusic, NewBackgroundMusic};
use crate::utils::db::AppDb;

use chrono::{Utc, Local};
use rusqlite::params;
use std::fs;
use std::path::Path;
use tauri::Manager;

pub fn add_music_into_db(db: &AppDb, data: NewBackgroundMusic) -> Result<BackgroundMusic, String> {
    let connection = db.connection.lock().unwrap();
    let created_at = Utc::now().to_rfc3339();

    let mut statement = connection.prepare("
        INSERT INTO background_music (nest_id, title, file_path, duration_seconds, order_index, is_selected, created_at, updated_at)
        VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)
        RETURNING id, nest_id, title, file_path, duration_seconds, order_index, is_selected, created_at, updated_at
    ").map_err(|e| e.to_string())?;

    let music = statement.query_row(
        params![
            data.nest_id,
            data.title,
            data.file_path,
            data.duration_seconds,
            data.order_index,
            data.is_selected,
            created_at,
            created_at
        ],
        |row| {
            Ok(BackgroundMusic {
                id: row.get(0)?,
                nest_id: row.get(1)?,
                title: row.get(2)?,
                file_path: row.get(3)?,
                duration_seconds: row.get(4)?,
                order_index: row.get(5)?,
                is_selected: row.get(6)?,
                created_at: row.get(7)?,
                updated_at: row.get(8)?,
            })
        },
    ).map_err(|e| e.to_string())?;

    Ok(music)
}

fn copy_music_to_app_dir(
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

    let music_dir = app_dir.join("music");

    fs::create_dir_all(&music_dir).map_err(|e| e.to_string())?;

    let filename = Path::new(&file_path)
        .file_name()
        .ok_or("Could not get filename")?
        .to_string_lossy();

    let timestamp = Local::now().timestamp_millis();
    let new_filename = format!("{}_{}", timestamp, filename);

    let destination = music_dir.join(&new_filename);
    let destination_str = destination.to_string_lossy().to_string();

    fs::copy(file_path, &destination).map_err(|e| format!("Failed to copy file: {}", e))?;

    Ok(destination_str)
}

pub fn import_music_into_app(
    app_handle: tauri::AppHandle,
    db: &AppDb, 
    nest_id: i64,
    file_path: String,
    title: String,
    duration_seconds: i64,
    order_index: i64,
) -> Result<BackgroundMusic, String> {
    let new_path = copy_music_to_app_dir(&app_handle, file_path)?;

    let new_music = NewBackgroundMusic {
        nest_id,
        title,
        file_path: new_path,
        duration_seconds,
        order_index,
        is_selected: false,
    };

    let saved_music = add_music_into_db(&db, new_music)?;
    Ok(saved_music)
}

pub fn get_music_from_db(db: &AppDb, nest_id: i64) -> Result<Vec<BackgroundMusic>, String> {
    let connection = db.connection.lock().unwrap();

    let mut statement = connection
        .prepare("
        SELECT id, nest_id, title, file_path, duration_seconds, order_index, is_selected, created_at, updated_at
        FROM background_music 
        WHERE nest_id = ?1 
        ORDER BY order_index ASC",
        )
        .map_err(|e| e.to_string())?;

    let rows = statement
        .query_map([nest_id], |row| {
            Ok(BackgroundMusic {
                id: row.get(0)?,
                nest_id: row.get(1)?,
                title: row.get(2)?,
                file_path: row.get(3)?,
                duration_seconds: row.get(4)?,
                order_index: row.get(5)?,
                is_selected: row.get(6)?,
                created_at: row.get(7)?,
                updated_at: row.get(8)?,
            })
        })
        .map_err(|e| e.to_string())?;

    let result = rows
        .collect::<Result<Vec<BackgroundMusic>, _>>()
        .map_err(|e| e.to_string())?;
    Ok(result)
}

fn get_music_by_id(db: &AppDb, id: i64) -> Result<BackgroundMusic, String> {
    let connection = db.connection.lock().unwrap();

    let mut statement = connection
        .prepare("
        SELECT id, nest_id, title, file_path, duration_seconds, order_index, is_selected, created_at, updated_at
        FROM background_music 
        WHERE id = ?1",
        )
        .map_err(|e| e.to_string())?;

    let music = statement
        .query_row([id], |row| {
            Ok(BackgroundMusic {
                id: row.get(0)?,
                nest_id: row.get(1)?,
                title: row.get(2)?,
                file_path: row.get(3)?,
                duration_seconds: row.get(4)?,
                order_index: row.get(5)?,
                is_selected: row.get(6)?,
                created_at: row.get(7)?,
                updated_at: row.get(8)?,
            })
        })
        .map_err(|e| e.to_string())?;

    Ok(music)
}

pub fn update_music_in_db(db: &AppDb, id: i64, title: String, order_index: i64) -> Result<(), String> {
    let connection = db.connection.lock().unwrap();
    let updated_at = Utc::now().to_rfc3339();

    connection
        .execute(
            "UPDATE background_music 
            SET title = ?1, order_index = ?2, updated_at = ?3
            WHERE id = ?4",
            params![
                title,
                order_index,
                updated_at,
                id
            ],
        )
        .map_err(|e| e.to_string())?;
    Ok(())
}

pub fn update_music_selection_in_db(db: &AppDb, nest_id: i64, id: i64) -> Result<(), String> {
    let connection = db.connection.lock().unwrap();
    let updated_at = Utc::now().to_rfc3339();
    
    connection
        .execute(
            "UPDATE background_music SET is_selected = 0 WHERE nest_id = ?1",
            params![nest_id]
        )
        .map_err(|e| e.to_string())?;
    
    connection
        .execute(
            "UPDATE background_music SET is_selected = 1, updated_at = ?1 WHERE id = ?2",
            params![updated_at, id]
        )
        .map_err(|e| e.to_string())?;
    
    Ok(())
}

pub fn delete_music_from_db(db: &AppDb, id: i64) -> Result<(), String> {
    let music = get_music_by_id(&db, id)?;

    if let Err(err) = fs::remove_file(&music.file_path) {
        if err.kind() != std::io::ErrorKind::NotFound {
            return Err(format!("Failed to delete file: {}", err));
        }
    }

    let connection = db.connection.lock().unwrap();
    connection
        .execute("DELETE FROM background_music WHERE id = ?1", params![id])
        .map_err(|e| e.to_string())?;
    Ok(())
}