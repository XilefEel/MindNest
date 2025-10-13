// handlers/user.rs
use crate::db::user::{authenticate_user, create_user};
use crate::models::user::{LoginData, SignupData, User};
use crate::utils::db::AppDb;

#[tauri::command]
pub fn signup_user(db: tauri::State<AppDb>, data: SignupData) -> Result<(), String> {
    create_user(&db, data)
}

#[tauri::command]
pub fn login_user(db: tauri::State<AppDb>, data: LoginData) -> Result<User, String> {
    authenticate_user(&db, data)
}
