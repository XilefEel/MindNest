use crate::models::nest::{NewNest, Nest};
use crate::utils::user::get_connection;
use rusqlite::params;

use chrono::Local;

pub fn create_nest_in_db(data: NewNest) -> Result<Nest, String> {
    let created_at = Local::now().naive_local().format("%Y-%m-%d %H:%M:%S").to_string();
    let connection = get_connection().map_err(|e| e.to_string())?;

    connection.execute(
        "INSERT INTO nests (user_id, title, created_at) VALUES (?1, ?2, ?3)",
        params![data.user_id, data.title, created_at],
    ).map_err(|e| e.to_string())?;

    let id = connection.last_insert_rowid();

    let mut statement = connection.prepare("SELECT id, user_id, title, created_at FROM nests WHERE id = ?1")
        .map_err(|e| e.to_string())?;

    let nest = statement.query_row([id], |row| {
        Ok(Nest {
            id: row.get(0)?,
            user_id: row.get(1)?,
            title: row.get(2)?,
            created_at: row.get(3)?,
        })
    }).map_err(|e| e.to_string())?;

    Ok(nest)
}

pub fn get_nests_by_user(user_id: i32) -> Result<Vec<Nest>, String> {
    let connection = get_connection().map_err(|e| e.to_string())?;

    let mut statement = connection.prepare(
        "SELECT id, user_id, title, created_at FROM nests WHERE user_id = ? ORDER BY created_at DESC"
    ).map_err(|e| e.to_string())?;

    let nests = statement
        .query_map(params![user_id], |row| {
            Ok(Nest {
                id: row.get("id")?,
                user_id: row.get("user_id")?,
                title: row.get("title")?,
                created_at: row.get("created_at")?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(nests)
}

pub fn update_nest_title(nest_id: i32, new_title: String) -> Result<(), String> {
    let conn = get_connection().map_err(|e| e.to_string())?;
    conn.execute(
        "UPDATE nests SET title = ?1 WHERE id = ?2",
        params![new_title, nest_id],
    ).map_err(|e| e.to_string())?;
    Ok(())
}

pub fn delete_nest_from_db(nest_id: i32) -> Result<(), String> {
    let conn = get_connection().map_err(|e| e.to_string())?;
    conn.execute(
        "DELETE FROM nests WHERE id = ?1",
        params![nest_id],
    ).map_err(|e| e.to_string())?;
    Ok(())
}

pub fn get_nest_data(nest_id: i32) -> Result<Nest, String> {
    let conn = get_connection().map_err(|e| e.to_string())?;
    let mut statement = conn.prepare(
        "SELECT id, user_id, title, created_at FROM nests WHERE id = ?1"
    ).map_err(|e| e.to_string())?;
    let nest = statement.query_row([nest_id], |row| {
        Ok(Nest {
            id: row.get(0)?,
            user_id: row.get(1)?,
            title: row.get(2)?,
            created_at: row.get(3)?,
        })
    }).map_err(|e| e.to_string())?;
    Ok(nest)
}