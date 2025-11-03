use crate::{models::nestling::{Nestling, NewNestling}, utils::db::AppDb};
use rusqlite::params;

use chrono;

pub fn insert_nestling_into_db(db: &AppDb, data: NewNestling) -> Result<Nestling, String> {
    let connection = db.connection.lock().unwrap();
    let created_at = chrono::Local::now()
        .naive_local()
        .format("%Y-%m-%d %H:%M:%S")
        .to_string();

    let mut statement = connection
        .prepare(
            "INSERT INTO nestlings (nest_id, folder_id, type, icon, is_pinned, title, content, created_at, updated_at)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)
             RETURNING id, nest_id, folder_id, type, icon, is_pinned, title, content, created_at, updated_at;",
        )
        .map_err(|e| e.to_string())?;

    let nestling = statement
        .query_row(
            params![
                data.nest_id,
                data.folder_id,
                data.nestling_type,
                data.icon,
                data.is_pinned,
                data.title,
                data.content,
                created_at,
                created_at
            ],
            |row| {
                Ok(Nestling {
                    id: row.get(0)?,
                    nest_id: row.get(1)?,
                    folder_id: row.get(2)?,
                    nestling_type: row.get(3)?,
                    icon: row.get(4)?,
                    is_pinned: row.get(5)?,
                    title: row.get(6)?,
                    content: row.get(7)?,
                    created_at: row.get(8)?,
                    updated_at: row.get(9)?,
                })
            },
        )
        .map_err(|e| e.to_string())?;

    Ok(nestling)
}

pub fn get_nestlings_by_nest(db: &AppDb, nest_id: i64) -> Result<Vec<Nestling>, String> {
    let connection = db.connection.lock().unwrap();

    let mut statement = connection
        .prepare("
        SELECT id, nest_id, folder_id, type, icon, is_pinned, title, content, created_at, updated_at 
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
                icon: row.get(4)?,
                is_pinned: row.get(5)?,
                title: row.get(6)?,
                content: row.get(7)?,
                created_at: row.get(8)?,
                updated_at: row.get(9)?,
            })
        })
        .map_err(|e| e.to_string())?;

    let result = rows
        .collect::<Result<Vec<Nestling>, _>>()
        .map_err(|e| e.to_string())?;
    Ok(result)
}

pub fn get_nestling_by_id(db: &AppDb, nestling_id: i64) -> Result<Nestling, String> {
    let connection = db.connection.lock().unwrap();

    let mut statement = connection
        .prepare("
            SELECT id, nest_id, folder_id, type, icon, is_pinned, title, content, created_at, updated_at
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
                icon: row.get(4)?,
                is_pinned: row.get(5)?,
                title: row.get(6)?,
                content: row.get(7)?,
                created_at: row.get(8)?,
                updated_at: row.get(9)?,
            })
        })
        .map_err(|e| e.to_string())?;

    Ok(result)
}

pub fn update_nestling_in_db(
    db: &AppDb, 
    id: i64, 
    folder_id: Option<i64>, 
    icon: Option<String>, 
    is_pinned: Option<bool>, 
    title: Option<String>, 
    content: Option<String>
) -> Result<(), String> {
    let connection = db.connection.lock().unwrap();
    let updated_at = chrono::Local::now()
        .naive_local()
        .format("%Y-%m-%d %H:%M:%S")
        .to_string();

    connection
        .execute("
            UPDATE nestlings
            SET folder_id = ?1,
                icon = ?2,
                is_pinned = ?3, 
                title = ?4, 
                content = ?5, 
                updated_at = ?6
            WHERE id = ?7",
            params![folder_id, icon, is_pinned, title, content, updated_at, id],
        )
        .map_err(|e| e.to_string())?;

    Ok(())
}

pub fn delete_nestling_from_db(db: &AppDb, id: i64) -> Result<(), String> {
    let connection = db.connection.lock().unwrap();

    connection.execute("DELETE FROM nestlings WHERE id = ?1", params![id])
        .map_err(|e| e.to_string())?;

    Ok(())
}