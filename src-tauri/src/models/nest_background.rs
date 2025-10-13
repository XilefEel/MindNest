use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize)]
pub struct NewBackgroundImage {
    pub nest_id: i64,
    pub file_path: String,
    pub is_selected: bool,
    pub width: i64,
    pub height: i64,
}

#[derive(Debug, Serialize)]
pub struct BackgroundImage {
    pub id: i64,
    pub nest_id: i64,
    pub file_path: String,
    pub is_selected: bool,
    pub width: i64,
    pub height: i64,
    pub created_at: String,
    pub updated_at: String,
}