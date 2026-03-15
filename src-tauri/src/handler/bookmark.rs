use crate::db::bookmark::{
    create_new_bookmark_in_db, delete_bookmark_from_db, get_bookmarks_by_nestling,
    toggle_bookmark_favorite_in_db,
};
use crate::models::bookmark::Bookmark;
use crate::utils::db::AppDb;
use crate::utils::errors::AppResult;

#[tauri::command]
pub async fn create_bookmark(
    db: tauri::State<'_, AppDb>,
    nestling_id: i64,
    url: String,
) -> AppResult<Bookmark> {
    create_new_bookmark_in_db(&db, nestling_id, url).await
}

#[tauri::command]
pub fn get_bookmarks(db: tauri::State<AppDb>, nestling_id: i64) -> AppResult<Vec<Bookmark>> {
    get_bookmarks_by_nestling(&db, nestling_id)
}

#[tauri::command]
pub fn toggle_bookmark_favorite(db: tauri::State<AppDb>, id: i64) -> AppResult<()> {
    toggle_bookmark_favorite_in_db(&db, id)
}

#[tauri::command]
pub fn delete_bookmark(db: tauri::State<AppDb>, id: i64) -> AppResult<()> {
    delete_bookmark_from_db(&db, id)
}
