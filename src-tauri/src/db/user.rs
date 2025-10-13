use crate::models::user::{LoginData, SignupData, User};

use crate::utils::db::AppDb;
use crate::utils::user::{hash_password, verify_password};
use rusqlite::params;

pub fn create_user(db: &AppDb, data: SignupData) -> Result<(), String> {
    let connection = db.connection.lock().unwrap();

    let mut stmt = connection
        .prepare("SELECT COUNT(*) FROM users WHERE email = ?1")
        .map_err(|e| e.to_string())?;
    let count: i64 = stmt
        .query_row(params![data.email], |row| row.get(0))
        .unwrap_or(0);
    if count > 0 {
        return Err("Email already exists.".into());
    }

    let hashed = hash_password(&data.password)?;
    connection
        .execute(
            "INSERT INTO users (username, email, password) VALUES (?1, ?2, ?3)",
            params![data.username, data.email, hashed],
        )
        .map_err(|e| e.to_string())?;

    Ok(())
}

pub fn authenticate_user(db: &AppDb, data: LoginData) -> Result<User, String> {
    let connection = db.connection.lock().unwrap();

    let mut stmt = connection
        .prepare("SELECT id, username, email, password FROM users WHERE email = ?1")
        .map_err(|e| e.to_string())?;

    let mut rows = stmt.query(params![data.email]).map_err(|e| e.to_string())?;

    if let Some(row) = rows.next().map_err(|e| e.to_string())? {
        let id: i32 = row.get(0).unwrap_or_default();
        let username: String = row.get(1).unwrap_or_default();
        let email: String = row.get(2).unwrap_or_default();
        let hashed_password: String = row.get(3).unwrap_or_default();

        if verify_password(&hashed_password, &data.password) {
            Ok(User {
                id,
                username,
                email,
            })
        } else {
            Err("Invalid password.".into())
        }
    } else {
        Err("User not found.".into())
    }
}
