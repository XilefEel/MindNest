use rusqlite::{params, Connection, Error};
use tauri::command;
use rand::rngs::OsRng;
use argon2::password_hash::SaltString;
use argon2::{
    password_hash::{
        PasswordHasher
    },
    Argon2
};
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize)]
pub struct SignupData {
    pub username: String,
    pub email: String,
    pub password: String,
}

#[derive(Debug, Deserialize)]
pub struct LoginData {
    pub email: String,
    pub password: String,
}

#[derive(Debug, Serialize)]
pub struct User {
    pub id: i32,
    pub username: String,
    pub email: String,
}

fn get_connection() -> Result<Connection, Error> {
    let path = "test.db";
    println!("Opening DB at: {}", path);
    Connection::open(path)
}

pub fn init_db() -> Result<(), String> {
    let connection = get_connection().map_err(|e| e.to_string())?;
    connection
        .execute(
            "CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL
            )",
            [],
        )
        .map_err(|e| e.to_string())?;
    Ok(())
}


fn hash_password(password: &str) -> Result<String, String> {
    let salt = SaltString::generate(&mut OsRng);
    Argon2::default()
        .hash_password(password.as_bytes(), &salt)
        .map(|hash| hash.to_string())
        .map_err(|e| e.to_string())
}

fn verify_password(hash: &str, password: &str) -> bool {
    use argon2::password_hash::{PasswordHash, PasswordVerifier};
    if let Ok(parsed_hash) = PasswordHash::new(hash) {
        Argon2::default().verify_password(password.as_bytes(), &parsed_hash).is_ok()
    } else {
        false
    }
}

#[command]
pub fn signup_user(data: SignupData) -> Result<(), String> {
    let connection = get_connection().map_err(|e| e.to_string())?;

    let mut stmt = connection
        .prepare("SELECT COUNT(*) FROM users WHERE email = ?1")
        .map_err(|e| e.to_string())?;
    let count: i64 = stmt.query_row(params![data.email], |row| row.get(0)).unwrap_or(0);
    if count > 0 {
        return Err("Email already exists.".into());
    }

    let hashed = hash_password(&data.password)?;
    connection.execute(
        "INSERT INTO users (username, email, password) VALUES (?1, ?2, ?3)",
        params![data.username, data.email, hashed],
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}

#[command]
pub fn login_user(data: LoginData) -> Result<User, String> {
    let connection = get_connection().map_err(|e| e.to_string())?;

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
            Ok(User { id, username, email })
        } else {
            Err("Invalid password.".into())
        }
    } else {
        Err("User not found.".into())
    }
}
