// handlers/user.rs
use crate::db::user::{authenticate_user, create_user};
use crate::models::user::{LoginData, SignupData, User};
use crate::utils::db::AppDb;
use crate::utils::errors::AppResult;

#[tauri::command]
pub fn signup_user(db: tauri::State<AppDb>, data: SignupData) -> AppResult<()> {
    create_user(&db, data)
}

#[tauri::command]
pub fn login_user(db: tauri::State<AppDb>, data: LoginData) -> AppResult<User> {
    authenticate_user(&db, data)
}
