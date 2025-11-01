use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
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
#[serde(rename_all = "camelCase")]
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