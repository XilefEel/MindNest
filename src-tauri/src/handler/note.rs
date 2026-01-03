use crate::{
    db::note::update_note,
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
