use crate::models::user::{LoginData, SignupData, User};

use crate::utils::auth::{hash_password, verify_password};
use crate::utils::db::AppDb;
use crate::utils::errors::{DbError, DbResult};
use rusqlite::params;

pub fn create_user(db: &AppDb, data: SignupData) -> DbResult<()> {
    let connection = db.connection.lock().unwrap();

    let mut statement = connection.prepare("SELECT COUNT(*) FROM users WHERE email = ?1")?;

    let count: i64 = statement.query_row(params![data.email], |row| row.get(0))?;

    if count > 0 {
        return Err(DbError::ValidationError("Email already exists".to_string()));
    }

    let hashed = hash_password(&data.password).map_err(|e| DbError::AuthError(e))?;

    connection.execute(
        "
            INSERT INTO users (username, email, password)
            VALUES (?1, ?2, ?3)",
        params![data.username, data.email, hashed],
    )?;

    Ok(())
}

pub fn authenticate_user(db: &AppDb, data: LoginData) -> DbResult<User> {
    let connection = db.connection.lock().unwrap();

    let mut statement = connection.prepare(
        "
            SELECT id, username, email, password 
            FROM users
            WHERE email = ?1",
    )?;

    let (id, username, email, hashed_password): (i64, String, String, String) = statement
        .query_row(params![data.email], |row| {
            Ok((row.get(0)?, row.get(1)?, row.get(2)?, row.get(3)?))
        })?;

    match verify_password(&hashed_password, &data.password) {
        Ok(true) => Ok(User {
            id,
            username,
            email,
        }),
        Ok(false) => Err(DbError::AuthError("Invalid password.".to_string())),
        Err(e) => Err(DbError::AuthError(e)),
    }
}
