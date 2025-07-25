// handlers/user.rs
use crate::models::user::{SignupData, LoginData, User};
use crate::db::user::{create_user, authenticate_user};

#[tauri::command]
pub fn signup_user(data: SignupData) -> Result<(), String> {
    create_user(data)
}

#[tauri::command]
pub fn login_user(data: LoginData) -> Result<User, String> {
    authenticate_user(data)
}
