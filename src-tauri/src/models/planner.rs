use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NewPlannerEvent {
    pub nestling_id: i64,
    pub date: String,
    pub title: String,
    pub description: Option<String>,
    pub start_time: f32,
    pub duration: f32,
    pub color: Option<String>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PlannerEvent {
    pub id: i64,
    pub nestling_id: i64,
    pub date: String,
    pub title: String,
    pub description: Option<String>,
    pub start_time: f32,
    pub duration: f32,
    pub color: String,
    pub created_at: String,
    pub updated_at: String,
}

impl TryFrom<&rusqlite::Row<'_>> for PlannerEvent {
    type Error = rusqlite::Error;

    fn try_from(row: &rusqlite::Row<'_>) -> Result<Self, Self::Error> {
        Ok(PlannerEvent {
            id: row.get(0)?,
            nestling_id: row.get(1)?,
            date: row.get(2)?,
            title: row.get(3)?,
            description: row.get(4)?,
            start_time: row.get(5)?,
            duration: row.get(6)?,
            color: row.get(7)?,
            created_at: row.get(8)?,
            updated_at: row.get(9)?,
        })
    }
}
