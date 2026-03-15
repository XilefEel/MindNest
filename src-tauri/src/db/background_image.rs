use crate::models::background_image::{BackgroundImage, NewBackgroundImage};
use crate::utils::db::AppDb;
use crate::utils::errors::{AppResult, LogError};
use chrono::Utc;
use rusqlite::params;

pub fn add_background_into_db(db: &AppDb, data: NewBackgroundImage) -> AppResult<BackgroundImage> {
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
            |row| BackgroundImage::try_from(row),
        )
        .log_err("add_background_into_db")?;

    Ok(image)
}

pub fn get_backgrounds_from_db(db: &AppDb, nest_id: i64) -> AppResult<Vec<BackgroundImage>> {
    let connection = db.connection.lock().unwrap();

    let mut statement = connection.prepare(
        "
            SELECT id, nest_id, file_path, is_selected, width, height, created_at, updated_at
            FROM background_images
            WHERE nest_id = ?1
            ORDER BY created_at DESC",
    )?;

    let images = statement
        .query_map([nest_id], |row| BackgroundImage::try_from(row))
        .log_err("get_backgrounds_from_db")?
        .collect::<Result<Vec<_>, _>>()?;

    Ok(images)
}

pub fn get_background_by_id(db: &AppDb, id: i64) -> AppResult<BackgroundImage> {
    let connection = db.connection.lock().unwrap();

    let mut statement = connection.prepare(
        "
            SELECT id, nest_id, file_path, is_selected, width, height, created_at, updated_at
            FROM background_images
            WHERE id = ?1",
    )?;

    let image = statement
        .query_row([id], |row| BackgroundImage::try_from(row))
        .log_err("get_background_by_id")?;

    Ok(image)
}

pub fn delete_background_from_db(db: &AppDb, id: i64) -> AppResult<()> {
    let connection = db.connection.lock().unwrap();

    connection
        .execute("DELETE FROM background_images WHERE id = ?1", params![id])
        .log_err("delete_background_from_db")?;

    Ok(())
}
