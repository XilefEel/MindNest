use rusqlite::params;

use crate::models::folder::{Folder, NewFolder};
use crate::utils::db::AppDb;

use chrono::Utc;

pub fn insert_folder_into_db(db: &AppDb, data: NewFolder) -> Result<Folder, String> {
    let connection = db.connection.lock().unwrap();

    let created_at = Utc::now().to_rfc3339();

    let mut statement = connection
        .prepare(
            "
            INSERT INTO folders (nest_id, parent_id, name, created_at, updated_at)
            VALUES (?1, ?2, ?3, ?4, ?5)
            RETURNING id, nest_id, parent_id, name, created_at, updated_at",
        )
        .map_err(|e| e.to_string())?;

    let folder = statement
        .query_row(
            params![
                data.nest_id,
                data.parent_id,
                data.name,
                created_at,
                created_at
            ],
            |row| {
                Ok(Folder {
                    id: row.get(0)?,
                    nest_id: row.get(1)?,
                    parent_id: row.get(2)?,
                    name: row.get(3)?,
                    created_at: row.get(4)?,
                    updated_at: row.get(5)?,
                })
            },
        )
        .map_err(|e| e.to_string())?;

    Ok(folder)
}

pub fn get_folders_by_nest(db: &AppDb, nest_id: i64) -> Result<Vec<Folder>, String> {
    let connection = db.connection.lock().unwrap();

    let mut statement = connection
        .prepare(
            "
            SELECT id, nest_id, parent_id, name, created_at, updated_at 
            FROM folders 
            WHERE nest_id = ?1 
            ORDER BY updated_at DESC",
        )
        .map_err(|e| e.to_string())?;

    let rows = statement
        .query_map([nest_id], |row| {
            Ok(Folder {
                id: row.get(0)?,
                nest_id: row.get(1)?,
                parent_id: row.get(2)?,
                name: row.get(3)?,
                created_at: row.get(4)?,
                updated_at: row.get(5)?,
            })
        })
        .map_err(|e| e.to_string())?;

    let result = rows
        .collect::<Result<Vec<Folder>, _>>()
        .map_err(|e| e.to_string())?;
    Ok(result)
}

pub fn update_folder_in_db(
    db: &AppDb,
    id: i64,
    parent_id: Option<i64>,
    name: Option<String>,
) -> Result<(), String> {
    let connection = db.connection.lock().unwrap();
    let updated_at = Utc::now().to_rfc3339();

    connection
        .execute(
            "
            UPDATE folders
            SET parent_id = ?1, name = COALESCE(?2, name), updated_at = ?3
            WHERE id = ?4",
            params![parent_id, name, updated_at, id],
        )
        .map_err(|e| e.to_string())?;

    Ok(())
}

pub fn delete_folder_from_db(db: &AppDb, id: i64) -> Result<(), String> {
    let connection = db.connection.lock().unwrap();

    connection
        .execute("DELETE FROM folders WHERE id = ?1", params![id])
        .map_err(|e| e.to_string())?;

    Ok(())
}
