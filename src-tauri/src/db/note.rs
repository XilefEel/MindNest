use crate::utils::db::AppDb;
use chrono::Utc;
use rusqlite::params;

pub fn update_note(
    db: &AppDb,
    id: i64,
    title: Option<String>,
    content: Option<String>,
) -> Result<(), String> {
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

    result.map_err(|e| e.to_string())?;
    Ok(())
}
