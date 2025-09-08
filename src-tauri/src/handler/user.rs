// handlers/user.rs
use crate::db::user::{authenticate_user, create_user};
use crate::models::user::{LoginData, SignupData, User};

#[tauri::command]
pub fn signup_user(data: SignupData) -> Result<(), String> {
    create_user(data)
}

#[tauri::command]
pub fn login_user(data: LoginData) -> Result<User, String> {
    authenticate_user(data)
}
