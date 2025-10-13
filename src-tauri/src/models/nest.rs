use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize)]
pub struct Nest {
    pub id: i32,
    pub user_id: i32,
    pub title: String,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Deserialize)]
pub struct NewNest {
    pub user_id: i32,
    pub title: String,
}
