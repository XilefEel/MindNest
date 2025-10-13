use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct NewFolder {
    pub nest_id: i64,
    pub parent_id: Option<i64>,
    pub name: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Folder {
    pub id: i64,
    pub nest_id: i64,
    pub parent_id: Option<i64>,
    pub name: String,
    pub created_at: String,
    pub updated_at: String,
}