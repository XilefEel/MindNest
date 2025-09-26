use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct NewNestling {
    pub nest_id: i64,
    pub folder_id: Option<i64>,
    pub nestling_type: String,
    pub title: String,
    pub content: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Nestling {
    pub id: i64,
    pub nest_id: i64,
    pub folder_id: Option<i64>,
    pub nestling_type: String,
    pub title: String,
    pub content: String,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct NewFolder {
    pub nest_id: i64,
    pub name: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Folder {
    pub id: i64,
    pub nest_id: i64,
    pub name: String,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct BoardColumn {
    pub id: i64,
    pub nestling_id: i64,
    pub title: String,
    pub order_index: i64,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct BoardCard {
    pub id: i64,
    pub column_id: i64,
    pub title: String,
    pub description: Option<String>,
    pub order_index: i64,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Serialize, Deserialize)]
pub struct NewBoardColumn {
    pub nestling_id: i64,
    pub title: String,
    pub order_index: i64,
}

#[derive(Serialize, Deserialize)]
pub struct NewBoardCard {
    pub column_id: i64,
    pub title: String,
    pub description: Option<String>,
    pub order_index: i64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct BoardData {
    pub nestling: Nestling,
    pub columns: Vec<BoardColumnData>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct BoardColumnData {
    pub column: BoardColumn,
    pub cards: Vec<BoardCard>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PlannerEvent {
    pub id: i64,
    pub nestling_id: i64,
    pub date: String,
    pub title: String,
    pub description: Option<String>,
    pub start_time: i64,
    pub duration: i64,
    pub color: String,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct NewPlannerEvent {
    pub nestling_id: i64,
    pub date: String,
    pub title: String,
    pub description: Option<String>,
    pub start_time: i64,
    pub duration: i64,
    pub color: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct JournalEntry {
    pub id: i64,
    pub nestling_id: i64,
    pub title: String,
    pub content: String,
    pub entry_date: String,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct NewJournalEntry {
    pub nestling_id: i64,
    pub title: String,
    pub content: String,
    pub entry_date: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct JournalTemplate {
    pub id: i64,
    pub nestling_id: i64,
    pub name: String,
    pub content: String,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct NewJournalTemplate {
    pub nestling_id: i64,
    pub name: String,
    pub content: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct GalleryAlbum {
    pub id: i64,
    pub nestling_id: i64,
    pub name: String,
    pub description: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct NewGalleryAlbum {
    pub nestling_id: i64,
    pub name: String,
    pub description: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct GalleryImage {
    pub id: i64,
    pub album_id: Option<i64>,
    pub nestling_id: i64,
    pub file_path: String,
    pub title: Option<String>,
    pub description: Option<String>,
    pub is_favorite: bool,
    pub width: i64,
    pub height: i64,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct NewGalleryImage {
    pub album_id: Option<i64>,
    pub nestling_id: i64,
    pub file_path: String,
    pub title: Option<String>,
    pub description: Option<String>,
    pub is_favorite: bool,
    pub width: i64,
    pub height: i64,
}

