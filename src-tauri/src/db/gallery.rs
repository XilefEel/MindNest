use crate::fs::file::delete_file;
use crate::models::gallery::{GalleryImage, NewGalleryImage};
use crate::utils::db::AppDb;
use crate::utils::errors::{AppResult, LogError};
use chrono::Utc;
use rusqlite::params;

pub fn add_image_into_db(db: &AppDb, data: NewGalleryImage) -> AppResult<GalleryImage> {
    let connection = db.conn()?;
    let created_at = Utc::now().to_rfc3339();

    let mut statement = connection
        .prepare("
            INSERT INTO gallery_images (nestling_id, file_path, title, description, is_favorite, width, height, created_at, updated_at)
            VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)
            RETURNING id, nestling_id, file_path, title, description, is_favorite, width, height, created_at, updated_at")?;

    let image = statement
        .query_row(
            params![
                data.nestling_id,
                data.file_path,
                data.title,
                data.description,
                data.is_favorite,
                data.width,
                data.height,
                created_at,
                created_at
            ],
            |row| GalleryImage::try_from(row),
        )
        .log_err("add_image_into_db")?;

    Ok(image)
}

pub fn get_images_from_db(db: &AppDb, nestling_id: i64) -> AppResult<Vec<GalleryImage>> {
    let connection = db.conn()?;
    let mut statement = connection
        .prepare("
            SELECT id, nestling_id, file_path, title, description, is_favorite, width, height, created_at, updated_at
            FROM gallery_images
            WHERE nestling_id = ?1
            ORDER BY is_favorite DESC, created_at DESC
        ")?;

    let images = statement
        .query_map(params![nestling_id], |row| GalleryImage::try_from(row))
        .log_err("get_images_from_db")?
        .collect::<Result<Vec<_>, _>>()?;

    Ok(images)
}

pub fn get_image_by_id(db: &AppDb, id: i64) -> AppResult<GalleryImage> {
    let connection = db.conn()?;

    let mut statement = connection
        .prepare("
            SELECT id, nestling_id, file_path, title, description, is_favorite, width, height, created_at, updated_at
            FROM gallery_images
            WHERE id = ?1"
        )?;

    let image = statement
        .query_row(params![id], |row| GalleryImage::try_from(row))
        .log_err("get_image_by_id")?;

    Ok(image)
}

pub fn update_image_in_db(
    db: &AppDb,
    id: i64,
    title: Option<String>,
    description: Option<String>,
    is_favorite: bool,
) -> AppResult<()> {
    let connection = db.conn()?;
    let updated_at = Utc::now().to_rfc3339();

    connection
        .execute(
            "
            UPDATE gallery_images
            SET title = ?1, description = ?2, is_favorite = ?3, updated_at = ?4
            WHERE id = ?5",
            params![title, description, is_favorite, updated_at, id],
        )
        .log_err("update_image_in_db")?;

    Ok(())
}

pub fn delete_image_from_db(db: &AppDb, id: i64) -> AppResult<()> {
    let image = get_image_by_id(&db, id)?;

    delete_file(&image.file_path);

    let connection = db.conn()?;
    connection
        .execute("DELETE FROM gallery_images WHERE id = ?1", params![id])
        .log_err("delete_gallery_image_from_db")?;

    Ok(())
}
