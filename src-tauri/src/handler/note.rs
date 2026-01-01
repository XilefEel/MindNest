use crate::{db::note::update_note, utils::db::AppDb};

#[tauri::command]
pub fn edit_note(
    db: tauri::State<AppDb>,
    id: i64,
    title: Option<String>,
    content: Option<String>,
) -> Result<(), String> {
    update_note(&db, id, title, content)
}
