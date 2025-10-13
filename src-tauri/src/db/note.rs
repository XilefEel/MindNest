use rusqlite::params;
use crate::utils::db::AppDb;

pub fn update_note(db: &AppDb, id: i64, title: Option<String>, content: Option<String>) -> Result<(), String> {
    let conn = db.connection.lock().unwrap();

    if title.is_some() && content.is_some() {
        conn.execute(
            "UPDATE nestlings SET title = ?1, content = ?2 WHERE id = ?3",
            params![title.unwrap(), content.unwrap(), &id],
        )
        .map_err(|e| e.to_string())?;
    } else if let Some(title) = title {
        conn.execute(
            "UPDATE nestlings SET title = ?1 WHERE id = ?2",
            params![title, &id],
        )
        .map_err(|e| e.to_string())?;
    } else if let Some(content) = content {
        conn.execute(
            "UPDATE nestlings SET content = ?1 WHERE id = ?2",
            params![content, &id],
        )
        .map_err(|e| e.to_string())?;
    }

    Ok(())
}
