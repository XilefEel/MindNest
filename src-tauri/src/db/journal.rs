use crate::utils::user::get_connection;
use crate::models::nestling::{JournalEntry, NewJournalEntry, JournalTemplate, NewJournalTemplate};
use rusqlite::params;

use chrono::Local;

pub fn insert_journal_entry_into_db(data: NewJournalEntry) -> Result<JournalEntry, String> {
    let connection = get_connection().map_err(|e| e.to_string())?;
    let created_at = chrono::Local::now().naive_local().format("%Y-%m-%d %H:%M:%S").to_string();
    
    let mut statement = connection.prepare("
        INSERT INTO journal_entries (nestling_id, title, content, entry_date, created_at, updated_at)
        VALUES (?1, ?2, ?3, ?4, ?5, ?6)
        RETURNING id, nestling_id, title, content, entry_date, created_at, updated_at
    ").map_err(|e| e.to_string())?;

    let journal_entry = statement.query_row(
        params![data.nestling_id, data.title, data.content, data.entry_date, created_at, created_at],
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
        }
    ).map_err(|e| e.to_string())?;
    Ok(journal_entry)
}

pub fn get_journal_entries_by_nestling(nestling_id: i64) -> Result<Vec<JournalEntry>, String> {
    let connection = get_connection().map_err(|e| e.to_string())?;
    let mut statement = connection.prepare("
        SELECT id, nestling_id, title, content, entry_date, created_at, updated_at
        FROM journal_entries
        WHERE nestling_id = ?1
        ORDER BY entry_date DESC
    ").map_err(|e| e.to_string())?;
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
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;
    Ok(journal_entries)
}

pub fn update_journal_entry_in_db(id: i64, title: String, content: String, entry_date: String) -> Result<(), String> {
    let connection = get_connection().map_err(|e| e.to_string())?;
    let updated_at = Local::now().naive_local().format("%Y-%m-%d %H:%M:%S").to_string();
    connection.execute("
        UPDATE journal_entries
        SET title = ?1, content = ?2, updated_at = ?3, entry_date = ?4
        WHERE id = ?5",
        params![title, content, updated_at, entry_date, id]
    ).map_err(|e| e.to_string())?;
    Ok(())
}

pub fn delete_journal_entry_from_db(id: i64) -> Result<(), String> {
    let connection = get_connection().map_err(|e| e.to_string())?;
    connection.execute("
        DELETE FROM journal_entries WHERE id = ?1",
        params![id]
    ).map_err(|e| e.to_string())?;
    Ok(())
}


pub fn insert_journal_template_into_db(data: NewJournalTemplate) -> Result<JournalTemplate, String> {
    let connection = get_connection().map_err(|e| e.to_string())?;
    let timestamp = chrono::Local::now().naive_local().format("%Y-%m-%d %H:%M:%S").to_string();

    let mut statement = connection.prepare("
        INSERT INTO journal_templates (nestling_id, name, content, created_at, updated_at)
        VALUES (?1, ?2, ?3, ?4, ?5)
        RETURNING id, nestling_id, name, content, created_at, updated_at
    ").map_err(|e| e.to_string())?;

    let journal_template = statement.query_row(
        params![data.nestling_id, data.name, data.content, timestamp, timestamp],
        |row| {
            Ok(JournalTemplate {
                id: row.get(0)?,
                nestling_id: row.get(1)?,
                name: row.get(2)?,
                content: row.get(3)?,
                created_at: row.get(4)?,
                updated_at: row.get(5)?,
            })
        }
    ).map_err(|e| e.to_string())?;

    Ok(journal_template)
}

pub fn get_journal_templates_by_nestling(nestling_id: i64) -> Result<Vec<JournalTemplate>, String> {
    let connection = get_connection().map_err(|e| e.to_string())?;
    let mut statement = connection.prepare("
        SELECT id, nestling_id, name, content, created_at, updated_at
        FROM journal_templates
        WHERE nestling_id = ?1
    ").map_err(|e| e.to_string())?;

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
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(journal_templates)
}

pub fn update_journal_template_in_db(id: i64, name: String, content: String) -> Result<(), String> {
    let connection = get_connection().map_err(|e| e.to_string())?;
    let updated_at = chrono::Local::now().naive_local().format("%Y-%m-%d %H:%M:%S").to_string();

    connection.execute("
        UPDATE journal_templates
        SET name = ?1, content = ?2, updated_at = ?3
        WHERE id = ?4
    ",
    params![name, content, updated_at, id]
    ).map_err(|e| e.to_string())?;

    Ok(())
}

pub fn delete_journal_template_from_db(id: i64) -> Result<(), String> {
    let connection = get_connection().map_err(|e| e.to_string())?;
    connection.execute("
        DELETE FROM journal_templates WHERE id = ?1
    ",
    params![id]
    ).map_err(|e| e.to_string())?;

    Ok(())
}
