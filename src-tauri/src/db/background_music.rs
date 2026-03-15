use crate::models::background_music::{BackgroundMusic, NewBackgroundMusic};
use crate::utils::db::AppDb;
use crate::utils::errors::{DbResult, LogError};
use chrono::Utc;
use rusqlite::params;

pub fn add_music_into_db(db: &AppDb, data: NewBackgroundMusic) -> DbResult<BackgroundMusic> {
    let connection = db.connection.lock().unwrap();
    let created_at = Utc::now().to_rfc3339();

    let mut statement = connection
        .prepare("
            INSERT INTO background_music (nest_id, title, file_path, duration_seconds, order_index, created_at, updated_at)
            VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)
            RETURNING id, nest_id, title, file_path, duration_seconds, order_index, created_at, updated_at"
        )?;

    let music = statement
        .query_row(
            params![
                data.nest_id,
                data.title,
                data.file_path,
                data.duration_seconds,
                data.order_index,
                created_at,
                created_at
            ],
            |row| BackgroundMusic::try_from(row),
        )
        .log_err("add_music_into_db")?;

    Ok(music)
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

    let music = statement
        .query_map([nest_id], |row| BackgroundMusic::try_from(row))
        .log_err("get_music_from_db")?
        .collect::<Result<Vec<_>, _>>()?;

    Ok(music)
}

pub fn get_music_by_id(db: &AppDb, id: i64) -> DbResult<BackgroundMusic> {
    let connection = db.connection.lock().unwrap();

    let mut statement = connection
        .prepare("
            SELECT id, nest_id, title, file_path, duration_seconds, order_index, created_at, updated_at
            FROM background_music
            WHERE id = ?1"
        )?;

    let music = statement
        .query_row([id], |row| BackgroundMusic::try_from(row))
        .log_err("get_music_by_id")?;

    Ok(music)
}

pub fn update_music_in_db(db: &AppDb, id: i64, title: String, order_index: i64) -> DbResult<()> {
    let connection = db.connection.lock().unwrap();
    let updated_at = Utc::now().to_rfc3339();

    connection
        .execute(
            "
            UPDATE background_music
            SET title = ?1, order_index = ?2, updated_at = ?3
            WHERE id = ?4",
            params![title, order_index, updated_at, id],
        )
        .log_err("update_music_in_db")?;

    Ok(())
}

pub fn delete_music_from_db(db: &AppDb, id: i64) -> DbResult<()> {
    let connection = db.connection.lock().unwrap();

    connection
        .execute("DELETE FROM background_music WHERE id = ?1", params![id])
        .log_err("delete_music_from_db")?;

    Ok(())
}
