use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NewBackgroundMusic {
    pub nest_id: i64,
    pub title: String,
    pub file_path: String,
    pub duration_seconds: i64,
    pub order_index: i64,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct BackgroundMusic {
    pub id: i64,
    pub nest_id: i64,
    pub title: String,
    pub file_path: String,
    pub duration_seconds: i64,
    pub order_index: i64,
    pub created_at: String,
    pub updated_at: String,
}
