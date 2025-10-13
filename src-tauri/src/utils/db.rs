use rusqlite::Connection;
use std::sync::Mutex;

pub struct AppDb {
    pub(crate) connection: Mutex<Connection>,
}

impl AppDb {
    pub fn new(path: &str) -> Result<Self, rusqlite::Error>{
        let connection = Connection::open(path)?;
        connection.execute("PRAGMA foreign_keys = ON;", [])?;
        Ok(Self {
            connection: Mutex::new(connection),
        })
    }
}

pub fn init_db(db: &AppDb) -> Result<(), String> {
    let connection = db.connection.lock().unwrap();
    
    let schema = include_str!("schema.sql");
    connection.execute_batch(schema)
        .map_err(|e| e.to_string())?;
    
    Ok(())
}