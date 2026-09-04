use crate::{
    models::nest::{Nest, NewNest},
    utils::{
        db::AppDb,
        errors::{AppResult, LogError},
    },
};
use chrono::Utc;
use rusqlite::params;

pub fn create_nest_in_db(db: &AppDb, data: NewNest) -> AppResult<Nest> {
    let connection = db.conn()?;
    let created_at = Utc::now().to_rfc3339();

    let mut statement = connection.prepare(
        "
            INSERT INTO nests (title, created_at, updated_at)
            VALUES (?1, ?2, ?3)
            RETURNING id, title, created_at, updated_at",
    )?;

    let nest = statement
        .query_row(params![data.title, created_at, created_at], |row| {
            Nest::try_from(row)
        })
        .log_err("create_nest_in_db")?;

    Ok(nest)
}

pub fn get_all_nests_from_db(db: &AppDb) -> AppResult<Vec<Nest>> {
    let connection = db.conn()?;

    let mut statement = connection.prepare(
        "
            SELECT id, title, created_at, updated_at
            FROM nests
            ORDER BY created_at DESC",
    )?;

    let nests = statement
        .query_map(params![], |row| Nest::try_from(row))
        .log_err("get_all_nests_from_db")?
        .collect::<Result<Vec<_>, _>>()?;

    Ok(nests)
}

pub fn get_nest_data(db: &AppDb, nest_id: i64) -> AppResult<Nest> {
    let connection = db.conn()?;

    let mut statement = connection.prepare(
        "
            SELECT id, title, created_at, updated_at
            FROM nests
            WHERE id = ?1",
    )?;

    let nest = statement
        .query_row([nest_id], |row| Nest::try_from(row))
        .log_err("get_nest_data")?;

    Ok(nest)
}

pub fn update_nest_title(db: &AppDb, nest_id: i64, new_title: String) -> AppResult<()> {
    let connection = db.conn()?;
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

pub fn delete_nest_from_db(db: &AppDb, nest_id: i64) -> AppResult<()> {
    let connection = db.conn()?;

    connection
        .execute("DELETE FROM nests WHERE id = ?1", params![nest_id])
        .log_err("delete_nest_from_db")?;

    Ok(())
}
