use crate::models::user::{LoginData, SignupData, User};

use crate::utils::auth::{hash_password, verify_password};
use crate::utils::db::AppDb;
use rusqlite::params;

pub fn create_user(db: &AppDb, data: SignupData) -> Result<(), String> {
    let connection = db.connection.lock().unwrap();

    let mut statement = connection
        .prepare("SELECT COUNT(*) FROM users WHERE email = ?1")
        .map_err(|e| e.to_string())?;
    let count: i64 = statement
        .query_row(params![data.email], |row| row.get(0))
        .map_err(|e| e.to_string())?;
    if count > 0 {
        return Err("Email already exists.".into());
    }

    let hashed = hash_password(&data.password)?;
    connection
        .execute(
            "
            INSERT INTO users (username, email, password)
            VALUES (?1, ?2, ?3)",
            params![data.username, data.email, hashed],
        )
        .map_err(|e| e.to_string())?;

    Ok(())
}

pub fn authenticate_user(db: &AppDb, data: LoginData) -> Result<User, String> {
    let connection = db.connection.lock().unwrap();

    let mut statement = connection
        .prepare(
            "
            SELECT id, username, email, password 
            FROM users
            WHERE email = ?1",
        )
        .map_err(|e| e.to_string())?;

    let (id, username, email, hashed_password): (i64, String, String, String) = statement
        .query_row(params![data.email], |row| {
            Ok((row.get(0)?, row.get(1)?, row.get(2)?, row.get(3)?))
        })
        .map_err(|e| e.to_string())?;

    match verify_password(&hashed_password, &data.password) {
        Ok(true) => Ok(User {
            id,
            username,
            email,
        }),
        Ok(false) => Err("Invalid password.".into()),
        Err(e) => Err(e.to_string()),
    }
}
