use crate::db::nest::{
    create_nest_in_db, delete_nest_from_db, get_nest_data, get_nests_by_user, update_nest_title,
};
use crate::models::nest::{Nest, NewNest};
use crate::utils::db::AppDb;

#[tauri::command]
pub fn create_nest(db: tauri::State<AppDb>, data: NewNest) -> Result<Nest, String> {
    println!("🌳 Creating nest...");
    create_nest_in_db(&db, data)
}

#[tauri::command]
pub fn get_user_nests(db: tauri::State<AppDb>, user_id: i64) -> Result<Vec<Nest>, String> {
    get_nests_by_user(&db, user_id)
}

#[tauri::command]
pub fn update_nest(db: tauri::State<AppDb>, nest_id: i64, new_title: String) -> Result<(), String> {
    update_nest_title(&db, nest_id, new_title)
}

#[tauri::command]
pub fn delete_nest(db: tauri::State<AppDb>, nest_id: i64) -> Result<(), String> {
    delete_nest_from_db(&db, nest_id)
}

#[tauri::command]
pub fn get_nest_by_id(db: tauri::State<AppDb>, nest_id: i64) -> Result<Nest, String> {
    get_nest_data(&db, nest_id)
}
