use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Tag {
    pub id: i64,
    pub nest_id: i64,
    pub name: String,
    pub color: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct NewTag {
    pub nest_id: i64,
    pub name: String,
    pub color: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct NestlingTag {
    pub nestling_id: i64,
    pub tag_id: i64,
    pub created_at: String,
}
