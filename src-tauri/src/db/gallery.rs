use crate::models::nestling::{GalleryAlbum, GalleryImage, NewGalleryAlbum, NewGalleryImage};
use crate::utils::user::get_connection;
use rusqlite::params;

use chrono::Local;
use imagesize::size;
use std::fs;
use std::path::Path;
use tauri::Manager;

fn add_image_into_db(data: NewGalleryImage) -> Result<GalleryImage, String> {
    let connection = get_connection().map_err(|e| e.to_string())?;
    let created_at = Local::now()
        .naive_local()
        .format("%Y-%m-%d %H:%M:%S")
        .to_string();

    let mut statement = connection.prepare("
        INSERT INTO gallery_images (album_id, nestling_id, file_path, title, description, tags, width, height, created_at, updated_at)
        VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)
        RETURNING id, album_id, nestling_id, file_path, title, description, tags, width, height, created_at, updated_at
    ").map_err(|e| e.to_string())?;

    let image = statement
        .query_row(
            params![
                data.album_id,
                data.nestling_id,
                data.file_path,
                data.title,
                data.description,
                data.tags,
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
                    tags: row.get(6)?,
                    width: row.get(7)?,
                    height: row.get(8)?,
                    created_at: row.get(9)?,
                    updated_at: row.get(10)?,
                })
            },
        )
        .map_err(|e| e.to_string())?;
    Ok(image)
}

fn get_image_dimensions(path: &str) -> Result<(i64, i64), String> {
    let dim = size(path).map_err(|e| e.to_string())?;
    Ok((dim.width as i64, dim.height as i64))
}

fn copy_image_to_app_dir(
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

    let images_dir = app_dir.join("gallery");

    fs::create_dir_all(&images_dir).map_err(|e| e.to_string())?;

    let filename = Path::new(&file_path)
        .file_name()
        .ok_or("Could not get filename")?
        .to_string_lossy();

    // Add timestamp (milliseconds) to filename to avoid collisions
    let timestamp = Local::now().timestamp_millis();
    let new_filename = format!("{}_{}", timestamp, filename);

    // Create destination path
    let destination = images_dir.join(&new_filename);
    let destination_str = destination.to_string_lossy().to_string();

    // Copy the file
    fs::copy(file_path, &destination).map_err(|e| format!("Failed to copy file: {}", e))?;

    Ok(destination_str)
}

pub fn import_image_into_app(
    app_handle: tauri::AppHandle,
    nestling_id: i64,
    file_path: String,
) -> Result<GalleryImage, String> {
    let new_path = copy_image_to_app_dir(&app_handle, file_path.clone())?;
    let (width, height) = get_image_dimensions(&new_path).map_err(|e| e.to_string())?;

    let new_image = NewGalleryImage {
        album_id: None,
        nestling_id,
        file_path: new_path,
        title: None,
        description: None,
        tags: None,
        width: width,
        height: height,
    };

    let saved_image = add_image_into_db(new_image).map_err(|e| e.to_string())?;
    Ok(saved_image)
}

pub fn get_images_from_db(nestling_id: i64) -> Result<Vec<GalleryImage>, String> {
    let connection = get_connection().map_err(|e| e.to_string())?;
    let mut statement = connection.prepare("
        SELECT id, album_id, nestling_id, file_path, title, description, tags, width, height, created_at, updated_at
        FROM gallery_images
        WHERE nestling_id = ?1
        ORDER BY created_at DESC
    ").map_err(|e| e.to_string())?;

    let images = statement
        .query_map(params![nestling_id], |row| {
            Ok(GalleryImage {
                id: row.get(0)?,
                album_id: row.get(1)?,
                nestling_id: row.get(2)?,
                file_path: row.get(3)?,
                title: row.get(4)?,
                description: row.get(5)?,
                tags: row.get(6)?,
                width: row.get(7)?,
                height: row.get(8)?,
                created_at: row.get(9)?,
                updated_at: row.get(10)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;
    Ok(images)
}

pub fn update_image_in_db(
    id: i64,
    album_id: Option<i64>,
    title: Option<String>,
    description: Option<String>,
    tags: Option<String>,
) -> Result<(), String> {
    let connection = get_connection().map_err(|e| e.to_string())?;
    let updated_at = Local::now()
        .naive_local()
        .format("%Y-%m-%d %H:%M:%S")
        .to_string();

    connection
        .execute(
            "
        UPDATE gallery_images
        SET album_id = ?1, title = ?2, description = ?3, tags = ?4, updated_at = ?5
        WHERE id = ?6
    ",
            params![album_id, title, description, tags, updated_at, id],
        )
        .map_err(|e| e.to_string())?;
    Ok(())
}

fn get_image_by_id(id: i64) -> Result<GalleryImage, String> {
    let connection = get_connection().map_err(|e| e.to_string())?;

    let mut statement = connection.prepare("
        SELECT id, album_id, nestling_id, file_path, title, description, tags, width, height, created_at, updated_at
        FROM gallery_images WHERE id = ?1
    ").map_err(|e| e.to_string())?;

    let image = statement
        .query_row(params![id], |row| {
            Ok(GalleryImage {
                id: row.get(0)?,
                album_id: row.get(1)?,
                nestling_id: row.get(2)?,
                file_path: row.get(3)?,
                title: row.get(4)?,
                description: row.get(5)?,
                tags: row.get(6)?,
                width: row.get(7)?,
                height: row.get(8)?,
                created_at: row.get(9)?,
                updated_at: row.get(10)?,
            })
        })
        .map_err(|e| e.to_string())?;

    Ok(image)
}

fn delete_gallery_image_from_db(id: i64) -> Result<(), String> {
    let connection = get_connection().map_err(|e| e.to_string())?;
    connection
        .execute(
            "
        DELETE FROM gallery_images WHERE id = ?1
    ",
            params![id],
        )
        .map_err(|e| e.to_string())?;
    Ok(())
}

pub fn delete_image_from_app(id: i64) -> Result<(), String> {
    let image = get_image_by_id(id).map_err(|e| e.to_string())?;

    if let Err(err) = fs::remove_file(&image.file_path) {
        if err.kind() != std::io::ErrorKind::NotFound {
            return Err(format!("Failed to delete file: {}", err));
        }
    }

    delete_gallery_image_from_db(id).map_err(|e| e.to_string())?;
    Ok(())
}

pub fn add_album_to_db(data: NewGalleryAlbum) -> Result<GalleryAlbum, String> {
    let connection = get_connection().map_err(|e| e.to_string())?;
    let created_at = Local::now()
        .naive_local()
        .format("%Y-%m-%d %H:%M:%S")
        .to_string();

    let mut statement = connection
        .prepare(
            "
        INSERT INTO gallery_albums (nestling_id, name, description, created_at, updated_at)
        VALUES (?1, ?2, ?3, ?4, ?5)
        RETURNING id, nestling_id, name, description, created_at, updated_at
    ",
        )
        .map_err(|e| e.to_string())?;

    let album = statement
        .query_row(
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
        )
        .map_err(|e| e.to_string())?;
    Ok(album)
}

pub fn get_albums_from_db(nestling_id: i64) -> Result<Vec<GalleryAlbum>, String> {
    let connection = get_connection().map_err(|e| e.to_string())?;
    let mut statement = connection
        .prepare(
            "
        SELECT id, nestling_id, name, description, created_at, updated_at
        FROM gallery_albums
        WHERE nestling_id = ?1
        ORDER BY created_at DESC
    ",
        )
        .map_err(|e| e.to_string())?;

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
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;
    Ok(albums)
}

pub fn update_album_in_db(
    id: i64,
    name: Option<String>,
    description: Option<String>,
) -> Result<(), String> {
    let connection = get_connection().map_err(|e| e.to_string())?;
    let updated_at = Local::now()
        .naive_local()
        .format("%Y-%m-%d %H:%M:%S")
        .to_string();

    connection
        .execute(
            "
        UPDATE gallery_albums
        SET name = ?1, description = ?2, updated_at = ?3
        WHERE id = ?4
    ",
            params![name, description, updated_at, id],
        )
        .map_err(|e| e.to_string())?;
    Ok(())
}

pub fn delete_album_from_db(id: i64) -> Result<(), String> {
    let connection = get_connection().map_err(|e| e.to_string())?;
    connection
        .execute(
            "
        DELETE FROM gallery_albums WHERE id = ?1
    ",
            params![id],
        )
        .map_err(|e| e.to_string())?;
    Ok(())
}
