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