use crate::db::note::update_note;

#[tauri::command]
pub fn edit_note(id: i64, title: Option<String>, content: Option<String>) -> Result<(), String> {
    update_note(id, title, content)
}