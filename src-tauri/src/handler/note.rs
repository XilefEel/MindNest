use crate::{
    db::note::{
        delete_template_from_db, get_templates_by_nestling, insert_template_into_db, update_note,
        update_template_in_db,
    },
    models::note::{NewNoteTemplate, NoteTemplate},
    utils::{db::AppDb, errors::DbResult},
};

#[tauri::command]
pub fn edit_note(
    db: tauri::State<AppDb>,
    id: i64,
    title: Option<String>,
    content: Option<String>,
) -> DbResult<()> {
    update_note(&db, id, title, content)
}

#[tauri::command]
pub fn create_note_template(
    db: tauri::State<AppDb>,
    data: NewNoteTemplate,
) -> DbResult<NoteTemplate> {
    insert_template_into_db(&db, data)
}

#[tauri::command]
pub fn get_note_templates(
    db: tauri::State<AppDb>,
    nestling_id: i64,
) -> DbResult<Vec<NoteTemplate>> {
    get_templates_by_nestling(&db, nestling_id)
}

#[tauri::command]
pub fn update_note_template(
    db: tauri::State<AppDb>,
    id: i64,
    name: String,
    content: String,
) -> DbResult<()> {
    update_template_in_db(&db, id, name, content)
}

#[tauri::command]
pub fn delete_note_template(db: tauri::State<AppDb>, id: i64) -> DbResult<()> {
    delete_template_from_db(&db, id)
}
