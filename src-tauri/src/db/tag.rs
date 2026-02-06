use crate::utils::errors::{DbError, DbResult};
use crate::{
    models::tag::{NewTag, Tag},
    utils::db::AppDb,
};
use chrono::Utc;
use rusqlite::params;

pub fn insert_tag_into_db(db: &AppDb, data: NewTag) -> DbResult<Tag> {
    let connection = db.connection.lock().unwrap();
    let created_at = Utc::now().to_rfc3339();

    let mut statement = connection.prepare(
        "
            INSERT INTO tags (nest_id, name, color, created_at, updated_at)
            VALUES (?1, ?2, ?3, ?4, ?5)
            RETURNING id, nest_id, name, color, created_at, updated_at",
    )?;

    let tag = statement.query_row(
        params![data.nest_id, data.name, data.color, created_at, created_at],
        |row| {
            Ok(Tag {
                id: row.get(0)?,
                nest_id: row.get(1)?,
                name: row.get(2)?,
                color: row.get(3)?,
                created_at: row.get(4)?,
                updated_at: row.get(5)?,
            })
        },
    )?;

    Ok(tag)
}

pub fn get_tags_by_nest(db: &AppDb, nest_id: i64) -> DbResult<Vec<Tag>> {
    let connection = db.connection.lock().unwrap();

    let mut statement = connection.prepare(
        "
            SELECT id, nest_id, name, color, created_at, updated_at
            FROM tags
            WHERE nest_id = ?1
            ORDER BY name ASC",
    )?;

    let rows = statement.query_map([nest_id], |row| {
        Ok(Tag {
            id: row.get(0)?,
            nest_id: row.get(1)?,
            name: row.get(2)?,
            color: row.get(3)?,
            created_at: row.get(4)?,
            updated_at: row.get(5)?,
        })
    })?;

    let result = rows.collect::<Result<Vec<Tag>, _>>()?;

    Ok(result)
}

pub fn update_tag_in_db(
    db: &AppDb,
    id: i64,
    name: Option<String>,
    color: Option<String>,
) -> DbResult<()> {
    let connection = db.connection.lock().unwrap();
    let updated_at = Utc::now().to_rfc3339();

    connection.execute(
        "
            UPDATE tags
            SET name = ?1, color = ?2, updated_at = ?3
            WHERE id = ?4",
        params![name, color, updated_at, id],
    )?;

    Ok(())
}

pub fn delete_tag_from_db(db: &AppDb, id: i64) -> DbResult<()> {
    let connection = db.connection.lock().unwrap();

    let rows_affected = connection.execute("DELETE FROM tags WHERE id = ?1", params![id])?;

    if rows_affected == 0 {
        return Err(DbError::NotFound);
    }

    Ok(())
}

pub fn add_tag_to_nestling(db: &AppDb, nestling_id: i64, tag_id: i64) -> DbResult<()> {
    let connection = db.connection.lock().unwrap();
    let created_at = Utc::now().to_rfc3339();

    connection.execute(
        "
            INSERT INTO nestling_tags (nestling_id, tag_id, created_at)
            VALUES (?1, ?2, ?3)",
        params![nestling_id, tag_id, created_at],
    )?;

    Ok(())
}

pub fn get_tags_for_nestling(db: &AppDb, nestling_id: i64) -> DbResult<Vec<Tag>> {
    let connection = db.connection.lock().unwrap();

    let mut statement = connection.prepare(
        "
            SELECT tags.id, tags.nest_id, tags.name, tags.color, tags.created_at, tags.updated_at
            FROM tags
            JOIN nestling_tags ON tags.id = nestling_tags.tag_id
            WHERE nestling_tags.nestling_id = ?1
            ORDER BY tags.name ASC",
    )?;

    let rows = statement.query_map([nestling_id], |row| {
        Ok(Tag {
            id: row.get(0)?,
            nest_id: row.get(1)?,
            name: row.get(2)?,
            color: row.get(3)?,
            created_at: row.get(4)?,
            updated_at: row.get(5)?,
        })
    })?;

    let result = rows.collect::<Result<Vec<Tag>, _>>()?;

    Ok(result)
}

pub fn remove_tag_from_nestling(db: &AppDb, nestling_id: i64, tag_id: i64) -> DbResult<()> {
    let connection = db.connection.lock().unwrap();

    let rows_affected = connection.execute(
        "DELETE FROM nestling_tags WHERE nestling_id = ?1 AND tag_id = ?2",
        params![nestling_id, tag_id],
    )?;

    if rows_affected == 0 {
        return Err(DbError::NotFound);
    }

    Ok(())
}
