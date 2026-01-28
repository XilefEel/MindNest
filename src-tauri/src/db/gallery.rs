use crate::models::gallery::{GalleryAlbum, GalleryImage, NewGalleryAlbum, NewGalleryImage};
use crate::utils::db::AppDb;
use crate::utils::errors::{DbError, DbResult};
use rusqlite::params;

use chrono::{Local, Utc};
use imagesize::size;
use std::fs;
use std::io::Write;
use std::path::Path;
use tauri::Manager;
use zip::ZipWriter;

pub fn add_image_into_db(db: &AppDb, data: NewGalleryImage) -> DbResult<GalleryImage> {
    let connection = db.connection.lock().unwrap();
    let created_at = Utc::now().to_rfc3339();

    let mut statement = connection
        .prepare("
            INSERT INTO gallery_images (album_id, nestling_id, file_path, title, description, is_favorite, width, height, created_at, updated_at)
            VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)
            RETURNING id, album_id, nestling_id, file_path, title, description, is_favorite, width, height, created_at, updated_at")?;

    let image = statement.query_row(
        params![
            data.album_id,
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
        |row| {
            Ok(GalleryImage {
                id: row.get(0)?,
                album_id: row.get(1)?,
                nestling_id: row.get(2)?,
                file_path: row.get(3)?,
                title: row.get(4)?,
                description: row.get(5)?,
                is_favorite: row.get(6)?,
                width: row.get(7)?,
                height: row.get(8)?,
                created_at: row.get(9)?,
                updated_at: row.get(10)?,
            })
        },
    )?;

    Ok(image)
}

fn get_image_dimensions(path: &str) -> DbResult<(i64, i64)> {
    let dim = size(path)?;
    Ok((dim.width as i64, dim.height as i64))
}

fn copy_image_to_app_dir(app_handle: &tauri::AppHandle, file_path: String) -> DbResult<String> {
    if !Path::new(&file_path).exists() {
        return Err(DbError::ValidationError("File does not exist".to_string()));
    }

    let app_dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| DbError::ValidationError(e.to_string()))?;

    let images_dir = app_dir.join("gallery");

    fs::create_dir_all(&images_dir)?;

    let filename = Path::new(&file_path)
        .file_name()
        .ok_or_else(|| DbError::ValidationError("Could not get filename".to_string()))?
        .to_string_lossy();

    let timestamp = Local::now().timestamp_millis();
    let new_filename = format!("{}_{}", timestamp, filename);

    let destination = images_dir.join(&new_filename);
    let destination_str = destination.to_string_lossy().to_string();

    fs::copy(file_path, &destination)?;

    Ok(destination_str)
}

pub fn import_image_into_app(
    app_handle: tauri::AppHandle,
    db: &AppDb,
    nestling_id: i64,
    album_id: Option<i64>,
    file_path: String,
) -> DbResult<GalleryImage> {
    let new_path = copy_image_to_app_dir(&app_handle, file_path.clone())?;
    let (width, height) = get_image_dimensions(&new_path)?;

    let new_image = NewGalleryImage {
        album_id: album_id,
        nestling_id,
        file_path: new_path,
        title: None,
        description: None,
        is_favorite: false,
        width: width,
        height: height,
    };

    let saved_image = add_image_into_db(&db, new_image)?;
    Ok(saved_image)
}

pub fn import_image_data_into_app(
    app_handle: tauri::AppHandle,
    db: &AppDb,
    nestling_id: i64,
    album_id: Option<i64>,
    file_name: String,
    file_data: Vec<u8>,
    title: Option<String>,
    description: Option<String>,
    is_favorite: Option<bool>,
) -> DbResult<GalleryImage> {
    let app_dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| DbError::ValidationError(e.to_string()))?;

    let images_dir = app_dir.join("gallery");
    fs::create_dir_all(&images_dir)?;

    let timestamp = Local::now().timestamp_millis();
    let new_filename = format!("{}_{}", timestamp, file_name);
    let destination = images_dir.join(&new_filename);

    fs::write(&destination, file_data)?;

    let destination_str = destination.to_string_lossy().to_string();
    let (width, height) = get_image_dimensions(&destination_str)?;

    let new_image = NewGalleryImage {
        album_id,
        nestling_id,
        file_path: destination_str,
        title,
        description,
        is_favorite: is_favorite.unwrap_or(false),
        width,
        height,
    };

    let saved_image = add_image_into_db(&db, new_image)?;
    Ok(saved_image)
}

pub fn duplicate_image_from_image(
    db: &AppDb,
    app_handle: tauri::AppHandle,
    original_image_id: i64,
) -> DbResult<GalleryImage> {
    let original_image = get_image_by_id(&db, original_image_id)?;

    if !Path::new(&original_image.file_path).exists() {
        return Err(DbError::ValidationError(
            "Original image file no longer exists".to_string(),
        ));
    }

    let image_data = fs::read(&original_image.file_path)?;

    let original_filename = Path::new(&original_image.file_path)
        .file_name()
        .ok_or_else(|| DbError::ValidationError("Could not get filename".to_string()))?
        .to_string_lossy()
        .to_string();

    let duplicated_image = import_image_data_into_app(
        app_handle,
        &db,
        original_image.nestling_id,
        original_image.album_id,
        original_filename,
        image_data,
        original_image.title.clone(),
        original_image.description.clone(),
        Some(original_image.is_favorite),
    )?;

    Ok(duplicated_image)
}

pub fn get_images_from_db(db: &AppDb, nestling_id: i64) -> DbResult<Vec<GalleryImage>> {
    let connection = db.connection.lock().unwrap();
    let mut statement = connection
        .prepare("
            SELECT id, album_id, nestling_id, file_path, title, description, is_favorite, width, height, created_at, updated_at
            FROM gallery_images
            WHERE nestling_id = ?1
            ORDER BY is_favorite DESC, created_at DESC
        ")?;

    let images = statement
        .query_map(params![nestling_id], |row| {
            Ok(GalleryImage {
                id: row.get(0)?,
                album_id: row.get(1)?,
                nestling_id: row.get(2)?,
                file_path: row.get(3)?,
                title: row.get(4)?,
                description: row.get(5)?,
                is_favorite: row.get(6)?,
                width: row.get(7)?,
                height: row.get(8)?,
                created_at: row.get(9)?,
                updated_at: row.get(10)?,
            })
        })?
        .collect::<Result<Vec<_>, _>>()?;

    Ok(images)
}

fn get_image_by_id(db: &AppDb, id: i64) -> DbResult<GalleryImage> {
    let connection = db.connection.lock().unwrap();

    let mut statement = connection
        .prepare("
            SELECT id, album_id, nestling_id, file_path, title, description, is_favorite, width, height, created_at, updated_at
            FROM gallery_images
            WHERE id = ?1"
        )?;

    let image = statement.query_row(params![id], |row| {
        Ok(GalleryImage {
            id: row.get(0)?,
            album_id: row.get(1)?,
            nestling_id: row.get(2)?,
            file_path: row.get(3)?,
            title: row.get(4)?,
            description: row.get(5)?,
            is_favorite: row.get(6)?,
            width: row.get(7)?,
            height: row.get(8)?,
            created_at: row.get(9)?,
            updated_at: row.get(10)?,
        })
    })?;

    Ok(image)
}

fn get_images_by_album_id(db: &AppDb, album_id: i64) -> DbResult<Vec<GalleryImage>> {
    let connection = db.connection.lock().unwrap();
    let mut statement = connection
        .prepare("
            SELECT id, album_id, nestling_id, file_path, title, description, is_favorite, width, height, created_at, updated_at
            FROM gallery_images
            WHERE album_id = ?1
            ORDER BY is_favorite DESC, created_at DESC"
        )?;

    let images = statement
        .query_map(params![album_id], |row| {
            Ok(GalleryImage {
                id: row.get(0)?,
                album_id: row.get(1)?,
                nestling_id: row.get(2)?,
                file_path: row.get(3)?,
                title: row.get(4)?,
                description: row.get(5)?,
                is_favorite: row.get(6)?,
                width: row.get(7)?,
                height: row.get(8)?,
                created_at: row.get(9)?,
                updated_at: row.get(10)?,
            })
        })?
        .collect::<Result<Vec<_>, _>>()?;

    Ok(images)
}

pub fn download_image_into_user(db: &AppDb, image_id: i64, save_path: String) -> DbResult<()> {
    let image = get_image_by_id(&db, image_id)?;
    fs::copy(&image.file_path, &save_path)?;

    Ok(())
}

pub fn download_album_into_user(db: &AppDb, album_id: i64, save_path: String) -> DbResult<()> {
    let images = get_images_by_album_id(&db, album_id)?;
    if images.is_empty() {
        return Err(DbError::ValidationError(
            "No images found in this album".to_string(),
        ));
    }

    let file = fs::File::create(&save_path)?;
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

        zip.start_file(&filename, zip::write::FileOptions::<()>::default())?;

        let image_data = fs::read(&image.file_path)?;
        zip.write_all(&image_data)?;
    }

    zip.finish()?;

    Ok(())
}

pub fn update_image_in_db(
    db: &AppDb,
    id: i64,
    album_id: Option<i64>,
    title: Option<String>,
    description: Option<String>,
    is_favorite: bool,
) -> DbResult<()> {
    let connection = db.connection.lock().unwrap();
    let updated_at = Utc::now().to_rfc3339();

    connection.execute(
        "
            UPDATE gallery_images
            SET album_id = ?1, title = ?2, description = ?3, is_favorite = ?4, updated_at = ?5
            WHERE id = ?6",
        params![album_id, title, description, is_favorite, updated_at, id],
    )?;

    Ok(())
}

fn delete_gallery_image_from_db(db: &AppDb, id: i64) -> DbResult<()> {
    let connection = db.connection.lock().unwrap();
    connection.execute("DELETE FROM gallery_images WHERE id = ?1", params![id])?;

    Ok(())
}

pub fn delete_image_from_app(db: &AppDb, id: i64) -> DbResult<()> {
    let image = get_image_by_id(&db, id)?;

    let _ = fs::remove_file(&image.file_path);

    delete_gallery_image_from_db(&db, id)?;
    Ok(())
}

pub fn add_album_to_db(db: &AppDb, data: NewGalleryAlbum) -> DbResult<GalleryAlbum> {
    let connection = db.connection.lock().unwrap();
    let created_at = Utc::now().to_rfc3339();

    let mut statement = connection.prepare(
        "
            INSERT INTO gallery_albums (nestling_id, name, description, created_at, updated_at)
            VALUES (?1, ?2, ?3, ?4, ?5)
            RETURNING id, nestling_id, name, description, created_at, updated_at",
    )?;

    let album = statement.query_row(
        params![
            data.nestling_id,
            data.name,
            data.description,
            created_at,
            created_at
        ],
        |row| {
            Ok(GalleryAlbum {
                id: row.get(0)?,
                nestling_id: row.get(1)?,
                name: row.get(2)?,
                description: row.get(3)?,
                created_at: row.get(4)?,
                updated_at: row.get(5)?,
            })
        },
    )?;
    Ok(album)
}

pub fn get_albums_from_db(db: &AppDb, nestling_id: i64) -> DbResult<Vec<GalleryAlbum>> {
    let connection = db.connection.lock().unwrap();
    let mut statement = connection.prepare(
        "
            SELECT id, nestling_id, name, description, created_at, updated_at
            FROM gallery_albums
            WHERE nestling_id = ?1
            ORDER BY created_at DESC",
    )?;

    let albums = statement
        .query_map(params![nestling_id], |row| {
            Ok(GalleryAlbum {
                id: row.get(0)?,
                nestling_id: row.get(1)?,
                name: row.get(2)?,
                description: row.get(3)?,
                created_at: row.get(4)?,
                updated_at: row.get(5)?,
            })
        })?
        .collect::<Result<Vec<_>, _>>()?;

    Ok(albums)
}

pub fn update_album_in_db(
    db: &AppDb,
    id: i64,
    name: Option<String>,
    description: Option<String>,
) -> DbResult<()> {
    let connection = db.connection.lock().unwrap();
    let updated_at = Utc::now().to_rfc3339();

    connection.execute(
        "
            UPDATE gallery_albums
            SET name = ?1, description = ?2, updated_at = ?3
            WHERE id = ?4",
        params![name, description, updated_at, id],
    )?;

    Ok(())
}

pub fn delete_album_from_db(db: &AppDb, id: i64) -> DbResult<()> {
    let connection = db.connection.lock().unwrap();
    connection.execute("DELETE FROM gallery_albums WHERE id = ?1", params![id])?;

    Ok(())
}
