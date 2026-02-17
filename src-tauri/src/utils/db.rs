use rusqlite::Connection;
use std::sync::Mutex;
use tauri::Manager;

pub struct AppDb {
    pub(crate) connection: Mutex<Connection>,
}

impl AppDb {
    pub fn new(path: &str) -> Result<Self, rusqlite::Error> {
        let connection = Connection::open(path)?;

        connection.execute_batch(
            "PRAGMA foreign_keys = ON;
             PRAGMA journal_mode = WAL;
             PRAGMA busy_timeout = 5000;",
        )?;

        Ok(Self {
            connection: Mutex::new(connection),
        })
    }
}

pub fn init_db(db: &AppDb) -> Result<(), String> {
    let connection = db.connection.lock().unwrap();

    let schema = include_str!("schema.sql");
    connection
        .execute_batch(schema)
        .map_err(|e| e.to_string())?;

    Ok(())
}

pub fn get_db_path(app: &tauri::App) -> String {
    let app_dir = app
        .path()
        .app_data_dir()
        .expect("Failed to get app directory");

    std::fs::create_dir_all(&app_dir).expect("Failed to create app data directory");

    app_dir.join("app.db").to_string_lossy().to_string()
}
