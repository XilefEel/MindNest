// handlers/user.rs
use crate::db::user::{authenticate_user, create_user};
use crate::models::user::{LoginData, SignupData, User};
use crate::utils::db::AppDb;
use crate::utils::errors::DbResult;

#[tauri::command]
pub fn signup_user(db: tauri::State<AppDb>, data: SignupData) -> DbResult<()> {
    create_user(&db, data)
}

#[tauri::command]
pub fn login_user(db: tauri::State<AppDb>, data: LoginData) -> DbResult<User> {
    authenticate_user(&db, data)
}
