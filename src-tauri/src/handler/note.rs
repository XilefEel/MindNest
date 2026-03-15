use crate::{
    db::note::{
        delete_template_from_db, get_templates_by_nestling, insert_template_into_db, update_note,
        update_template_in_db,
    },
    models::note::{NewNoteTemplate, NoteTemplate},
    utils::{db::AppDb, errors::AppResult},
};

#[tauri::command]
pub fn edit_note(
    db: tauri::State<AppDb>,
    id: i64,
    title: Option<String>,
    content: Option<String>,
) -> AppResult<()> {
    update_note(&db, id, title, content)
}

#[tauri::command]
pub fn create_note_template(
    db: tauri::State<AppDb>,
    data: NewNoteTemplate,
) -> AppResult<NoteTemplate> {
    insert_template_into_db(&db, data)
}

#[tauri::command]
pub fn get_note_templates(db: tauri::State<AppDb>, nest_id: i64) -> AppResult<Vec<NoteTemplate>> {
    get_templates_by_nestling(&db, nest_id)
}

#[tauri::command]
pub fn update_note_template(
    db: tauri::State<AppDb>,
    id: i64,
    name: String,
    content: String,
) -> AppResult<()> {
    update_template_in_db(&db, id, name, content)
}

#[tauri::command]
pub fn delete_note_template(db: tauri::State<AppDb>, id: i64) -> AppResult<()> {
    delete_template_from_db(&db, id)
}
