use crate::models::nest::{Nest, NewNest};
use crate::db::nest::{
    create_nest_in_db,
    get_nests_by_user,
    update_nest_title,
    delete_nest_from_db,
    get_nest_data
};

#[tauri::command]
pub fn create_nest(data: NewNest) -> Result<Nest, String> {
    create_nest_in_db(data)
}

#[tauri::command]
pub fn get_user_nests(user_id: i32) -> Result<Vec<Nest>, String> {
    get_nests_by_user(user_id)
}

#[tauri::command]
pub fn update_nest(nest_id: i32, new_title: String) -> Result<(), String> {
    update_nest_title(nest_id, new_title)
}

#[tauri::command]
pub fn delete_nest(nest_id: i32) -> Result<(), String> {
    delete_nest_from_db(nest_id)
}

#[tauri::command]
pub fn get_nest_by_id(nest_id: i32) -> Result<Nest, String> {
    get_nest_data(nest_id)
}