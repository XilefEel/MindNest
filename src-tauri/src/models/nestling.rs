use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct NewNestling {
    pub nest_id: i64,
    pub folder_id: Option<i64>,
    pub nestling_type: String,
    pub is_pinned: bool,
    pub title: String,
    pub content: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Nestling {
    pub id: i64,
    pub nest_id: i64,
    pub folder_id: Option<i64>,
    pub nestling_type: String,
    pub is_pinned: bool,
    pub title: String,
    pub content: String,
    pub created_at: String,
    pub updated_at: String,
}
