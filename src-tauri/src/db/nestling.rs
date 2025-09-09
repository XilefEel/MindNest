use crate::models::nestling::{Folder, Nestling, NewFolder, NewNestling};
use crate::utils::user::get_connection;
use rusqlite::params;

use chrono;

pub fn insert_nestling_into_db(data: NewNestling) -> Result<(), String> {
    let connection = get_connection().map_err(|e| e.to_string())?;

    let created_at = chrono::Local::now()
        .naive_local()
        .format("%Y-%m-%d %H:%M:%S")
        .to_string();

    connection.execute(
        "INSERT INTO nestlings (nest_id, folder_id, type, title, content, created_at, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)",
        params![
            data.nest_id,
            data.folder_id,
            data.nestling_type,
            data.title,
            data.content,   
            created_at,
            created_at
        ],
    ).map_err(|e| e.to_string())?;
    Ok(())
}

pub fn get_nestlings_by_nest(nest_id: i32) -> Result<Vec<Nestling>, String> {
    let connection = get_connection().map_err(|e| e.to_string())?;

    let mut statement = connection
        .prepare(
            "
        SELECT id, nest_id, folder_id, type, title, content, created_at, updated_at 
        FROM nestlings 
        WHERE nest_id = ?1 
        ORDER BY updated_at DESC",
        )
        .map_err(|e| e.to_string())?;

    let rows = statement
        .query_map([nest_id], |row| {
            Ok(Nestling {
                id: row.get(0)?,
                nest_id: row.get(1)?,
                folder_id: row.get(2)?,
                nestling_type: row.get(3)?,
                title: row.get(4)?,
                content: row.get(5)?,
                created_at: row.get(6)?,
                updated_at: row.get(7)?,
            })
        })
        .map_err(|e| e.to_string())?;

    let result = rows
        .collect::<Result<Vec<Nestling>, _>>()
        .map_err(|e| e.to_string())?;
    Ok(result)
}

pub fn get_nestling_by_id(nestling_id: i64) -> Result<Nestling, String> {
    let connection = get_connection().map_err(|e| e.to_string())?;
    let mut statement = connection
        .prepare(
            "SELECT id, nest_id, folder_id, title, type, content, created_at, updated_at
         FROM nestlings
         WHERE id = ?1",
        )
        .map_err(|e| e.to_string())?;

    let result = statement
        .query_row([nestling_id], |row| {
            Ok(Nestling {
                id: row.get(0)?,
                nest_id: row.get(1)?,
                folder_id: row.get(2)?,
                nestling_type: row.get(3)?,
                title: row.get(4)?,
                content: row.get(5)?,
                created_at: row.get(6)?,
                updated_at: row.get(7)?,
            })
        })
        .map_err(|e| e.to_string())?;
    Ok(result)
}

pub fn insert_folder_into_db(data: NewFolder) -> Result<(), String> {
    let connection = get_connection().map_err(|e| e.to_string())?;

    let created_at = chrono::Local::now()
        .naive_local()
        .format("%Y-%m-%d %H:%M:%S")
        .to_string();

    connection
        .execute(
            "INSERT INTO folders (nest_id, name, created_at, updated_at)
         VALUES (?1, ?2, ?3, ?4)",
            params![data.nest_id, data.name, created_at, created_at],
        )
        .map_err(|e| e.to_string())?;
    Ok(())
}

pub fn get_folders_by_nest(nest_id: i32) -> Result<Vec<Folder>, String> {
    let connection = get_connection().map_err(|e| e.to_string())?;

    let mut statement = connection
        .prepare(
            "SELECT id, nest_id, name, created_at, updated_at 
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
                name: row.get(2)?,
                created_at: row.get(3)?,
                updated_at: row.get(4)?,
            })
        })
        .map_err(|e| e.to_string())?;

    let result = rows
        .collect::<Result<Vec<Folder>, _>>()
        .map_err(|e| e.to_string())?;
    Ok(result)
}

pub fn update_nestling_folder(id: i64, folder_id: Option<i64>) -> Result<(), String> {
    let conn = get_connection().map_err(|e| e.to_string())?;

    conn.execute(
        "UPDATE nestlings SET folder_id = ?1, updated_at = CURRENT_TIMESTAMP WHERE id = ?2",
        params![folder_id, id],
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}

pub fn delete_nestling_from_db(id: i64) -> Result<(), String> {
    let conn = get_connection().map_err(|e| e.to_string())?;

    conn.execute("DELETE FROM nestlings WHERE id = ?1", params![id])
        .map_err(|e| e.to_string())?;

    Ok(())
}

pub fn delete_folder_from_db(id: i64) -> Result<(), String> {
    let conn = get_connection().map_err(|e| e.to_string())?;

    conn.execute("DELETE FROM folders WHERE id = ?1", params![id])
        .map_err(|e| e.to_string())?;

    Ok(())
}
