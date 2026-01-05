use crate::models::background_music::{BackgroundMusic, NewBackgroundMusic};
use crate::utils::db::AppDb;
use crate::utils::errors::{DbError, DbResult};

use chrono::{Local, Utc};
use lofty::file::{AudioFile, TaggedFileExt};
use lofty::probe::Probe;
use lofty::tag::Accessor;
use rusqlite::params;
use std::fs;
use std::path::Path;
use tauri::Manager;

pub fn add_music_into_db(db: &AppDb, data: NewBackgroundMusic) -> DbResult<BackgroundMusic> {
    let connection = db.connection.lock().unwrap();
    let created_at = Utc::now().to_rfc3339();

    let mut statement = connection
        .prepare("
            INSERT INTO background_music (nest_id, title, file_path, duration_seconds, order_index, created_at, updated_at)
            VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)
            RETURNING id, nest_id, title, file_path, duration_seconds, order_index, created_at, updated_at"
        )?;

    let music = statement.query_row(
        params![
            data.nest_id,
            data.title,
            data.file_path,
            data.duration_seconds,
            data.order_index,
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
                created_at: row.get(6)?,
                updated_at: row.get(7)?,
            })
        },
    )?;

    Ok(music)
}

fn extract_music_metadata(file_path: &str) -> DbResult<(String, i64)> {
    let tagged_file = Probe::open(file_path)?.read()?;

    let title = tagged_file
        .primary_tag()
        .or_else(|| tagged_file.first_tag())
        .and_then(|tag| tag.title().map(|t| t.to_string()))
        .unwrap_or_else(|| "Unknown".to_string());

    let duration = tagged_file.properties().duration().as_secs() as i64;

    Ok((title, duration))
}

fn copy_music_to_app_dir(app_handle: &tauri::AppHandle, file_path: String) -> DbResult<String> {
    if !Path::new(&file_path).exists() {
        return Err(DbError::ValidationError("File does not exist".to_string()));
    }

    let app_dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| DbError::ValidationError(e.to_string()))?;

    let music_dir = app_dir.join("music");

    fs::create_dir_all(&music_dir)?;

    let filename = Path::new(&file_path)
        .file_name()
        .ok_or_else(|| DbError::ValidationError("Could not get filename".to_string()))?;

    let timestamp = Local::now().timestamp_millis();
    let new_filename = format!("{}_{}", timestamp, filename.to_string_lossy());

    let destination = music_dir.join(&new_filename);
    let destination_str = destination.to_string_lossy().to_string();

    fs::copy(file_path, &destination)?;

    Ok(destination_str)
}

pub fn import_music_into_app(
    app_handle: tauri::AppHandle,
    db: &AppDb,
    nest_id: i64,
    file_path: String,
    order_index: i64,
) -> DbResult<BackgroundMusic> {
    let (title, duration_seconds) = extract_music_metadata(&file_path)?;
    let new_path = copy_music_to_app_dir(&app_handle, file_path)?;

    let new_music = NewBackgroundMusic {
        nest_id,
        title,
        file_path: new_path,
        duration_seconds,
        order_index,
    };

    let saved_music = add_music_into_db(&db, new_music)?;

    Ok(saved_music)
}

pub fn get_music_from_db(db: &AppDb, nest_id: i64) -> DbResult<Vec<BackgroundMusic>> {
    let connection = db.connection.lock().unwrap();

    let mut statement = connection
        .prepare("
            SELECT id, nest_id, title, file_path, duration_seconds, order_index, created_at, updated_at
            FROM background_music 
            WHERE nest_id = ?1 
            ORDER BY order_index ASC"
        )?;

    let rows = statement.query_map([nest_id], |row| {
        Ok(BackgroundMusic {
            id: row.get(0)?,
            nest_id: row.get(1)?,
            title: row.get(2)?,
            file_path: row.get(3)?,
            duration_seconds: row.get(4)?,
            order_index: row.get(5)?,
            created_at: row.get(6)?,
            updated_at: row.get(7)?,
        })
    })?;

    let result = rows.collect::<Result<Vec<_>, _>>()?;

    Ok(result)
}

fn get_music_by_id(db: &AppDb, id: i64) -> DbResult<BackgroundMusic> {
    let connection = db.connection.lock().unwrap();

    let mut statement = connection
        .prepare("
            SELECT id, nest_id, title, file_path, duration_seconds, order_index, created_at, updated_at
            FROM background_music 
            WHERE id = ?1"
        )?;

    let music = statement.query_row([id], |row| {
        Ok(BackgroundMusic {
            id: row.get(0)?,
            nest_id: row.get(1)?,
            title: row.get(2)?,
            file_path: row.get(3)?,
            duration_seconds: row.get(4)?,
            order_index: row.get(5)?,
            created_at: row.get(6)?,
            updated_at: row.get(7)?,
        })
    })?;

    Ok(music)
}

pub fn update_music_in_db(db: &AppDb, id: i64, title: String, order_index: i64) -> DbResult<()> {
    let connection = db.connection.lock().unwrap();
    let updated_at = Utc::now().to_rfc3339();

    connection.execute(
        "
            UPDATE background_music 
            SET title = ?1, order_index = ?2, updated_at = ?3
            WHERE id = ?4",
        params![title, order_index, updated_at, id],
    )?;

    Ok(())
}

pub fn delete_music_from_db(db: &AppDb, id: i64) -> DbResult<()> {
    let music = get_music_by_id(&db, id)?;

    let _ = fs::remove_file(&music.file_path);

    let connection = db.connection.lock().unwrap();

    connection.execute("DELETE FROM background_music WHERE id = ?1", params![id])?;

    Ok(())
}
