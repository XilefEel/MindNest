use crate::{
    models::nest::{Nest, NewNest},
    utils::{
        db::AppDb,
        errors::{DbResult, LogError},
    },
};
use chrono::Utc;
use rusqlite::params;

pub fn create_nest_in_db(db: &AppDb, data: NewNest) -> DbResult<Nest> {
    let connection = db.connection.lock().unwrap();
    let created_at = Utc::now().to_rfc3339();

    let mut statement = connection.prepare(
        "
            INSERT INTO nests (user_id, title, created_at, updated_at)
            VALUES (?1, ?2, ?3, ?4)
            RETURNING id, user_id, title, created_at, updated_at",
    )?;

    let nest = statement
        .query_row(
            params![data.user_id, data.title, created_at, created_at],
            |row| {
                Ok(Nest {
                    id: row.get(0)?,
                    user_id: row.get(1)?,
                    title: row.get(2)?,
                    created_at: row.get(3)?,
                    updated_at: row.get(4)?,
                })
            },
        )
        .log_err("create_nest_in_db")?;

    Ok(nest)
}

pub fn get_nests_by_user(db: &AppDb, user_id: i64) -> DbResult<Vec<Nest>> {
    let connection = db.connection.lock().unwrap();

    let mut statement = connection.prepare(
        "
            SELECT id, user_id, title, created_at, updated_at
            FROM nests
            WHERE user_id = ?1
            ORDER BY created_at DESC",
    )?;

    let nests = statement
        .query_map(params![user_id], |row| {
            Ok(Nest {
                id: row.get("id")?,
                user_id: row.get("user_id")?,
                title: row.get("title")?,
                created_at: row.get("created_at")?,
                updated_at: row.get("updated_at")?,
            })
        })
        .log_err("get_nests_by_user")?
        .collect::<Result<Vec<_>, _>>()?;

    Ok(nests)
}

pub fn get_nest_data(db: &AppDb, nest_id: i64) -> DbResult<Nest> {
    let connection = db.connection.lock().unwrap();

    let mut statement = connection.prepare(
        "
            SELECT id, user_id, title, created_at, updated_at
            FROM nests
            WHERE id = ?1",
    )?;

    let nest = statement
        .query_row([nest_id], |row| {
            Ok(Nest {
                id: row.get(0)?,
                user_id: row.get(1)?,
                title: row.get(2)?,
                created_at: row.get(3)?,
                updated_at: row.get(4)?,
            })
        })
        .log_err("get_nest_data")?;

    Ok(nest)
}

pub fn update_nest_title(db: &AppDb, nest_id: i64, new_title: String) -> DbResult<()> {
    let connection = db.connection.lock().unwrap();
    let updated_at = Utc::now().to_rfc3339();

    connection
        .execute(
            "
            UPDATE nests SET title = ?1, updated_at = ?2 WHERE id = ?3",
            params![new_title, updated_at, nest_id],
        )
        .log_err("update_nest_title")?;

    Ok(())
}

pub fn delete_nest_from_db(db: &AppDb, nest_id: i64) -> DbResult<()> {
    let connection = db.connection.lock().unwrap();

    connection
        .execute("DELETE FROM nests WHERE id = ?1", params![nest_id])
        .log_err("delete_nest_from_db")?;

    Ok(())
}
