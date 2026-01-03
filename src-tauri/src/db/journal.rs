use crate::models::journal::{JournalEntry, JournalTemplate, NewJournalEntry, NewJournalTemplate};
use crate::utils::db::AppDb;
use crate::utils::errors::DbResult;
use rusqlite::params;

use chrono::Utc;

pub fn insert_journal_entry_into_db(db: &AppDb, data: NewJournalEntry) -> DbResult<JournalEntry> {
    let connection = db.connection.lock().unwrap();
    let created_at = Utc::now().to_rfc3339();

    let mut statement = connection
        .prepare("
            INSERT INTO journal_entries (nestling_id, title, content, entry_date, created_at, updated_at)
            VALUES (?1, ?2, ?3, ?4, ?5, ?6)
            RETURNING id, nestling_id, title, content, entry_date, created_at, updated_at")
        ?;

    let journal_entry = statement.query_row(
        params![
            data.nestling_id,
            data.title,
            data.content,
            data.entry_date,
            created_at,
            created_at
        ],
        |row| {
            Ok(JournalEntry {
                id: row.get(0)?,
                nestling_id: row.get(1)?,
                title: row.get(2)?,
                content: row.get(3)?,
                entry_date: row.get(4)?,
                created_at: row.get(5)?,
                updated_at: row.get(6)?,
            })
        },
    )?;

    Ok(journal_entry)
}

pub fn get_journal_entries_by_nestling(
    db: &AppDb,
    nestling_id: i64,
) -> DbResult<Vec<JournalEntry>> {
    let connection = db.connection.lock().unwrap();

    let mut statement = connection.prepare(
        "
            SELECT id, nestling_id, title, content, entry_date, created_at, updated_at
            FROM journal_entries
            WHERE nestling_id = ?1
            ORDER BY entry_date DESC",
    )?;

    let journal_entries = statement
        .query_map(params![nestling_id], |row| {
            Ok(JournalEntry {
                id: row.get(0)?,
                nestling_id: row.get(1)?,
                title: row.get(2)?,
                content: row.get(3)?,
                entry_date: row.get(4)?,
                created_at: row.get(5)?,
                updated_at: row.get(6)?,
            })
        })?
        .collect::<Result<Vec<_>, _>>()?;

    Ok(journal_entries)
}

pub fn update_journal_entry_in_db(
    db: &AppDb,
    id: i64,
    title: String,
    content: String,
    entry_date: String,
) -> DbResult<()> {
    let connection = db.connection.lock().unwrap();
    let updated_at = Utc::now().to_rfc3339();

    connection.execute(
        "
            UPDATE journal_entries
            SET title = ?1, content = ?2, updated_at = ?3, entry_date = ?4
            WHERE id = ?5",
        params![title, content, updated_at, entry_date, id],
    )?;

    Ok(())
}

pub fn delete_journal_entry_from_db(db: &AppDb, id: i64) -> DbResult<()> {
    let connection = db.connection.lock().unwrap();
    connection.execute("DELETE FROM journal_entries WHERE id = ?1", params![id])?;

    Ok(())
}

pub fn insert_journal_template_into_db(
    db: &AppDb,
    data: NewJournalTemplate,
) -> DbResult<JournalTemplate> {
    let connection = db.connection.lock().unwrap();
    let timestamp = Utc::now().to_rfc3339();

    let mut statement = connection.prepare(
        "
            INSERT INTO journal_templates (nestling_id, name, content, created_at, updated_at)
            VALUES (?1, ?2, ?3, ?4, ?5)
            RETURNING id, nestling_id, name, content, created_at, updated_at",
    )?;

    let journal_template = statement.query_row(
        params![
            data.nestling_id,
            data.name,
            data.content,
            timestamp,
            timestamp
        ],
        |row| {
            Ok(JournalTemplate {
                id: row.get(0)?,
                nestling_id: row.get(1)?,
                name: row.get(2)?,
                content: row.get(3)?,
                created_at: row.get(4)?,
                updated_at: row.get(5)?,
            })
        },
    )?;

    Ok(journal_template)
}

pub fn get_journal_templates_by_nestling(
    db: &AppDb,
    nestling_id: i64,
) -> DbResult<Vec<JournalTemplate>> {
    let connection = db.connection.lock().unwrap();

    let mut statement = connection.prepare(
        "
            SELECT id, nestling_id, name, content, created_at, updated_at
            FROM journal_templates
            WHERE nestling_id = ?1",
    )?;

    let journal_templates = statement
        .query_map(params![nestling_id], |row| {
            Ok(JournalTemplate {
                id: row.get(0)?,
                nestling_id: row.get(1)?,
                name: row.get(2)?,
                content: row.get(3)?,
                created_at: row.get(4)?,
                updated_at: row.get(5)?,
            })
        })?
        .collect::<Result<Vec<_>, _>>()?;

    Ok(journal_templates)
}

pub fn update_journal_template_in_db(
    db: &AppDb,
    id: i64,
    name: String,
    content: String,
) -> DbResult<()> {
    let connection = db.connection.lock().unwrap();
    let updated_at = Utc::now().to_rfc3339();

    connection.execute(
        "
            UPDATE journal_templates
            SET name = ?1, content = ?2, updated_at = ?3
            WHERE id = ?4",
        params![name, content, updated_at, id],
    )?;

    Ok(())
}

pub fn delete_journal_template_from_db(db: &AppDb, id: i64) -> DbResult<()> {
    let connection = db.connection.lock().unwrap();
    connection.execute("DELETE FROM journal_templates WHERE id = ?1", params![id])?;

    Ok(())
}
