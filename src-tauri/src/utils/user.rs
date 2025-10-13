use argon2::password_hash::SaltString;
use argon2::{password_hash::PasswordHasher, Argon2};
use rand::rngs::OsRng;

use crate::utils::db::AppDb;

pub fn init_db(db: &AppDb) -> Result<(), String> {
    let connection = db.connection.lock().unwrap();
    
    let schema = include_str!("schema.sql");
    connection.execute_batch(schema)
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
