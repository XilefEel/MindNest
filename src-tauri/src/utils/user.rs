use argon2::password_hash::SaltString;
use argon2::{password_hash::PasswordHasher, Argon2};
use rand::rngs::OsRng;
use rusqlite::{Connection, Error};
pub fn get_connection() -> Result<Connection, Error> {
    let path = "test.db";
    println!("Opening DB at: {}", path);
    Connection::open(path)
}

pub fn init_db() -> Result<(), String> {
    let connection = get_connection().map_err(|e| e.to_string())?;

    connection
        .execute("PRAGMA foreign_keys = ON;", [])
        .map_err(|e| e.to_string())?;

    connection
        .execute_batch(
            "
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS nests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            created_at TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS folders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nest_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            FOREIGN KEY (nest_id) REFERENCES nests(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS nestlings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nest_id INTEGER NOT NULL,
            folder_id INTEGER,
            type TEXT NOT NULL,
            title TEXT,
            content TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            FOREIGN KEY (nest_id) REFERENCES nests(id) ON DELETE CASCADE,
            FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE SET NULL
        );

        CREATE TABLE IF NOT EXISTS board_columns (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nestling_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            order_index INTEGER NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            FOREIGN KEY(nestling_id) REFERENCES nestlings(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS board_cards (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            column_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            order_index INTEGER NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            FOREIGN KEY(column_id) REFERENCES board_columns(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS planner_events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nestling_id INTEGER NOT NULL,
            date TEXT NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            start_time INTEGER NOT NULL,
            duration INTEGER NOT NULL,
            color TEXT NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            FOREIGN KEY (nestling_id) REFERENCES nestlings(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS journal_entries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nestling_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            content TEXT,
            entry_date TEXT NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            FOREIGN KEY (nestling_id) REFERENCES nestlings(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS journal_templates (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nestling_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            content TEXT NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            FOREIGN KEY (nestling_id) REFERENCES nestlings(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS gallery_albums (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nestling_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            description TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            FOREIGN KEY (nestling_id) REFERENCES nestlings(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS gallery_images (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            album_id INTEGER,
            nestling_id INTEGER NOT NULL,
            file_path TEXT NOT NULL,
            title TEXT,
            description TEXT,
            is_favorite BOOLEAN NOT NULL DEFAULT 0,
            width INTEGER NOT NULL,
            height INTEGER NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            FOREIGN KEY (album_id) REFERENCES gallery_albums(id) ON DELETE SET NULL,
            FOREIGN KEY (nestling_id) REFERENCES nestlings(id) ON DELETE CASCADE
        );
        ",
        )
        .map_err(|e| e.to_string())?;
    Ok(())
}

pub fn hash_password(password: &str) -> Result<String, String> {
    let salt = SaltString::generate(&mut OsRng);
    Argon2::default()
        .hash_password(password.as_bytes(), &salt)
        .map(|hash| hash.to_string())
        .map_err(|e| e.to_string())
}

pub fn verify_password(hash: &str, password: &str) -> bool {
    use argon2::password_hash::{PasswordHash, PasswordVerifier};
    if let Ok(parsed_hash) = PasswordHash::new(hash) {
        Argon2::default()
            .verify_password(password.as_bytes(), &parsed_hash)
            .is_ok()
    } else {
        false
    }
}
