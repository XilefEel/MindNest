use crate::db::journal::{
    delete_journal_entry_from_db, delete_journal_template_from_db, get_journal_entries_by_nestling,
    get_journal_templates_by_nestling, insert_journal_entry_into_db,
    insert_journal_template_into_db, update_journal_entry_in_db, update_journal_template_in_db,
};
use crate::models::journal::{JournalEntry, JournalTemplate, NewJournalEntry, NewJournalTemplate};
use crate::utils::db::AppDb;

#[tauri::command]
pub fn insert_journal_entry(db: tauri::State<AppDb>, data: NewJournalEntry) -> Result<JournalEntry, String> {
    insert_journal_entry_into_db(&db, data)
}

#[tauri::command]
pub fn get_journal_entries(db: tauri::State<AppDb>, nestling_id: i64) -> Result<Vec<JournalEntry>, String> {
    get_journal_entries_by_nestling(&db, nestling_id)
}

#[tauri::command]
pub fn update_journal_entry(
    db: tauri::State<AppDb>, 
    id: i64,
    title: String,
    content: String,
    entry_date: String,
) -> Result<(), String> {
    update_journal_entry_in_db(&db, id, title, content, entry_date)
}

#[tauri::command]
pub fn delete_journal_entry(db: tauri::State<AppDb>, id: i64) -> Result<(), String> {
    delete_journal_entry_from_db(&db, id)
}

#[tauri::command]
pub fn insert_journal_template(db: tauri::State<AppDb>, data: NewJournalTemplate) -> Result<JournalTemplate, String> {
    insert_journal_template_into_db(&db, data)
}

#[tauri::command]
pub fn get_journal_templates(db: tauri::State<AppDb>, nestling_id: i64) -> Result<Vec<JournalTemplate>, String> {
    get_journal_templates_by_nestling(&db, nestling_id)
}

#[tauri::command]
pub fn update_journal_template(db: tauri::State<AppDb>, id: i64, name: String, content: String) -> Result<(), String> {
    update_journal_template_in_db(&db, id, name, content)
}

#[tauri::command]
pub fn delete_journal_template(db: tauri::State<AppDb>, id: i64) -> Result<(), String> {
    delete_journal_template_from_db(&db, id)
}
