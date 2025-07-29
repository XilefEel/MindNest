use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct NewNestling {
    pub nest_id: i64,
    pub folder_id: Option<i64>,
    pub nestling_type: String, // e.g. "note"
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