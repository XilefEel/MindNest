use crate::models::nest::{Nest, NewNest};
use crate::db::nest::{create_nest_in_db, get_nests_by_user};

#[tauri::command]
pub fn create_nest(data: NewNest) -> Result<Nest, String> {
    create_nest_in_db(data)
}

#[tauri::command]
pub fn get_user_nests(user_id: i32) -> Result<Vec<Nest>, String> {
    get_nests_by_user(user_id)
}