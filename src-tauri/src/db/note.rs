use crate::utils::{db::AppDb, errors::DbResult};
use chrono::Utc;
use rusqlite::params;

use crate::models::note::{NewNoteTemplate, NoteTemplate};

pub fn update_note(
    db: &AppDb,
    id: i64,
    title: Option<String>,
    content: Option<String>,
) -> DbResult<()> {
    let connection = db.connection.lock().unwrap();
    let updated_at = Utc::now().to_rfc3339();

    let result = match (&title, &content) {
        (Some(t), Some(c)) => connection.execute(
            "UPDATE nestlings SET title = ?1, content = ?2, updated_at = ?3 WHERE id = ?4",
            params![t, c, updated_at, id],
        ),
        (Some(t), None) => connection.execute(
            "UPDATE nestlings SET title = ?1, updated_at = ?2 WHERE id = ?3",
            params![t, updated_at, id],
        ),
        (None, Some(c)) => connection.execute(
            "UPDATE nestlings SET content = ?1, updated_at = ?2 WHERE id = ?3",
            params![c, updated_at, id],
        ),
        (None, None) => return Ok(()),
    };

    result?;
    Ok(())
}

pub fn insert_template_into_db(db: &AppDb, data: NewNoteTemplate) -> DbResult<NoteTemplate> {
    let connection = db.connection.lock().unwrap();
    let created_at = Utc::now().to_rfc3339();

    let mut statement = connection.prepare(
        "
            INSERT INTO note_templates (nestling_id, name, content, created_at, updated_at)
            VALUES (?1, ?2, ?3, ?4, ?5)
            RETURNING id, nestling_id, name, content, created_at, updated_at",
    )?;

    let note_template = statement.query_row(
        params![
            data.nestling_id,
            data.name,
            data.content,
            created_at,
            created_at
        ],
        |row| {
            Ok(NoteTemplate {
                id: row.get(0)?,
                nestling_id: row.get(1)?,
                name: row.get(2)?,
                content: row.get(3)?,
                created_at: row.get(4)?,
                updated_at: row.get(5)?,
            })
        },
    )?;

    Ok(note_template)
}

pub fn get_templates_by_nestling(db: &AppDb, nestling_id: i64) -> DbResult<Vec<NoteTemplate>> {
    let connection = db.connection.lock().unwrap();

    let mut statement = connection.prepare(
        "
            SELECT id, nestling_id, name, content, created_at, updated_at
            FROM note_templates
            WHERE nestling_id = ?1",
    )?;

    let note_templates = statement
        .query_map(params![nestling_id], |row| {
            Ok(NoteTemplate {
                id: row.get(0)?,
                nestling_id: row.get(1)?,
                name: row.get(2)?,
                content: row.get(3)?,
                created_at: row.get(4)?,
                updated_at: row.get(5)?,
            })
        })?
        .collect::<Result<Vec<_>, _>>()?;

    Ok(note_templates)
}

pub fn update_template_in_db(db: &AppDb, id: i64, name: String, content: String) -> DbResult<()> {
    let connection = db.connection.lock().unwrap();
    let updated_at = Utc::now().to_rfc3339();

    connection.execute(
        "
            UPDATE note_templates
            SET name = ?1, content = ?2, updated_at = ?3
            WHERE id = ?4",
        params![name, content, updated_at, id],
    )?;

    Ok(())
}

pub fn delete_template_from_db(db: &AppDb, id: i64) -> DbResult<()> {
    let connection = db.connection.lock().unwrap();
    connection.execute("DELETE FROM note_templates WHERE id = ?1", params![id])?;

    Ok(())
}
