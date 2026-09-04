use crate::db::nest::{
    create_nest_in_db, delete_nest_from_db, get_all_nests_from_db, get_nest_data, update_nest_title,
};
use crate::models::nest::{Nest, NewNest};
use crate::utils::{db::AppDb, errors::AppResult};

#[tauri::command]
pub fn create_nest(db: tauri::State<AppDb>, data: NewNest) -> AppResult<Nest> {
    create_nest_in_db(&db, data)
}

#[tauri::command]
pub fn get_nests(db: tauri::State<AppDb>) -> AppResult<Vec<Nest>> {
    get_all_nests_from_db(&db)
}

#[tauri::command]
pub fn update_nest(db: tauri::State<AppDb>, nest_id: i64, new_title: String) -> AppResult<()> {
    update_nest_title(&db, nest_id, new_title)
}

#[tauri::command]
pub fn delete_nest(db: tauri::State<AppDb>, nest_id: i64) -> AppResult<()> {
    delete_nest_from_db(&db, nest_id)
}

#[tauri::command]
pub fn get_nest_by_id(db: tauri::State<AppDb>, nest_id: i64) -> AppResult<Nest> {
    get_nest_data(&db, nest_id)
}
