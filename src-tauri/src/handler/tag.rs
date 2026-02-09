use crate::db::tag::{
    add_tag_to_nestling, get_tags_by_nest, update_tag_in_db, delete_tag_from_db,
    insert_tag_into_db, get_all_nestling_tags_for_nest, remove_tag_from_nestling,
};
use crate::models::tag::{NewTag, Tag};
use crate::utils::db::AppDb;
use crate::utils::errors::DbResult;
use std::collections::HashMap;

#[tauri::command]
pub fn create_tag(db: tauri::State<AppDb>, data: NewTag) -> DbResult<Tag> {
    insert_tag_into_db(&db, data)
}

#[tauri::command]
pub fn get_tags(db: tauri::State<AppDb>, nest_id: i64) -> DbResult<Vec<Tag>> {
    get_tags_by_nest(&db, nest_id)
}

#[tauri::command]
pub fn update_tag(
    db: tauri::State<AppDb>,
    id: i64,
    name: Option<String>,
    color: Option<String>,
) -> DbResult<()> {
    update_tag_in_db(&db, id, name, color)
}

#[tauri::command]
pub fn delete_tag(db: tauri::State<AppDb>, id: i64) -> DbResult<()> {
    delete_tag_from_db(&db, id)
}

#[tauri::command]
pub fn attach_tag(db: tauri::State<AppDb>, nestling_id: i64, tag_id: i64) -> DbResult<()> {
    add_tag_to_nestling(&db, nestling_id, tag_id)
}

#[tauri::command]
pub fn get_all_nestling_tags(db: tauri::State<AppDb>, nest_id: i64) -> DbResult<HashMap<i64, Vec<Tag>>> {
    get_all_nestling_tags_for_nest(&db, nest_id)
}

#[tauri::command]
pub fn detach_tag(db: tauri::State<AppDb>, nestling_id: i64, tag_id: i64) -> DbResult<()> {
    remove_tag_from_nestling(&db, nestling_id, tag_id)
}
