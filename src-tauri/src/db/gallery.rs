use crate::fs::io::delete_file;
use crate::models::gallery::{GalleryAlbum, GalleryImage, NewGalleryAlbum, NewGalleryImage};
use crate::utils::db::AppDb;
use crate::utils::errors::{DbResult, LogError};
use chrono::Utc;
use rusqlite::params;

pub fn add_image_into_db(db: &AppDb, data: NewGalleryImage) -> DbResult<GalleryImage> {
    let connection = db.connection.lock().unwrap();
    let created_at = Utc::now().to_rfc3339();

    let mut statement = connection
        .prepare("
            INSERT INTO gallery_images (album_id, nestling_id, file_path, title, description, is_favorite, width, height, created_at, updated_at)
            VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)
            RETURNING id, album_id, nestling_id, file_path, title, description, is_favorite, width, height, created_at, updated_at")?;

    let image = statement
        .query_row(
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
        )
        .log_err("add_image_into_db")?;

    Ok(image)
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
        })
        .log_err("get_images_from_db")?
        .collect::<Result<Vec<_>, _>>()?;

    Ok(images)
}

pub fn get_image_by_id(db: &AppDb, id: i64) -> DbResult<GalleryImage> {
    let connection = db.connection.lock().unwrap();

    let mut statement = connection
        .prepare("
            SELECT id, album_id, nestling_id, file_path, title, description, is_favorite, width, height, created_at, updated_at
            FROM gallery_images
            WHERE id = ?1"
        )?;

    let image = statement
        .query_row(params![id], |row| {
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
        })
        .log_err("get_image_by_id")?;

    Ok(image)
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

    connection
        .execute(
            "
            UPDATE gallery_images
            SET album_id = ?1, title = ?2, description = ?3, is_favorite = ?4, updated_at = ?5
            WHERE id = ?6",
            params![album_id, title, description, is_favorite, updated_at, id],
        )
        .log_err("update_image_in_db")?;

    Ok(())
}

pub fn delete_image_from_db(db: &AppDb, id: i64) -> DbResult<()> {
    let image = get_image_by_id(&db, id)?;

    delete_file(&image.file_path);

    let connection = db.connection.lock().unwrap();
    connection
        .execute("DELETE FROM gallery_images WHERE id = ?1", params![id])
        .log_err("delete_gallery_image_from_db")?;

    Ok(())
}

// fn get_images_by_album_id(db: &AppDb, album_id: i64) -> DbResult<Vec<GalleryImage>> {
//     let connection = db.connection.lock().unwrap();
//     let mut statement = connection
//         .prepare("
//             SELECT id, album_id, nestling_id, file_path, title, description, is_favorite, width, height, created_at, updated_at
//             FROM gallery_images
//             WHERE album_id = ?1
//             ORDER BY is_favorite DESC, created_at DESC"
//         )?;

//     let images = statement
//         .query_map(params![album_id], |row| {
//             Ok(GalleryImage {
//                 id: row.get(0)?,
//                 album_id: row.get(1)?,
//                 nestling_id: row.get(2)?,
//                 file_path: row.get(3)?,
//                 title: row.get(4)?,
//                 description: row.get(5)?,
//                 is_favorite: row.get(6)?,
//                 width: row.get(7)?,
//                 height: row.get(8)?,
//                 created_at: row.get(9)?,
//                 updated_at: row.get(10)?,
//             })
//         })
//         .log_err("get_images_by_album_id")?
//         .collect::<Result<Vec<_>, _>>()?;

//     Ok(images)
// }

pub fn add_album_to_db(db: &AppDb, data: NewGalleryAlbum) -> DbResult<GalleryAlbum> {
    let connection = db.connection.lock().unwrap();
    let created_at = Utc::now().to_rfc3339();

    let mut statement = connection.prepare(
        "
            INSERT INTO gallery_albums (nestling_id, name, description, created_at, updated_at)
            VALUES (?1, ?2, ?3, ?4, ?5)
            RETURNING id, nestling_id, name, description, created_at, updated_at",
    )?;

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
        .log_err("add_album_to_db")?;
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
        })
        .log_err("get_albums_from_db")?
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

    connection
        .execute(
            "
            UPDATE gallery_albums
            SET name = ?1, description = ?2, updated_at = ?3
            WHERE id = ?4",
            params![name, description, updated_at, id],
        )
        .log_err("update_album_in_db")?;

    Ok(())
}

pub fn delete_album_from_db(db: &AppDb, id: i64) -> DbResult<()> {
    let connection = db.connection.lock().unwrap();
    connection
        .execute("DELETE FROM gallery_albums WHERE id = ?1", params![id])
        .log_err("delete_album_from_db")?;

    Ok(())
}
