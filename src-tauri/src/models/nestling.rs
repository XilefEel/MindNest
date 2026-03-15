use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NewNestling {
    pub nest_id: i64,
    pub folder_id: Option<i64>,
    pub nestling_type: String,
    pub icon: Option<String>,
    pub is_pinned: bool,
    pub title: String,
    pub content: String,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Nestling {
    pub id: i64,
    pub nest_id: i64,
    pub folder_id: Option<i64>,
    pub nestling_type: String,
    pub icon: Option<String>,
    pub is_pinned: bool,
    pub title: String,
    pub content: String,
    pub created_at: String,
    pub updated_at: String,
}

impl TryFrom<&rusqlite::Row<'_>> for Nestling {
    type Error = rusqlite::Error;

    fn try_from(row: &rusqlite::Row<'_>) -> Result<Self, Self::Error> {
        Ok(Nestling {
            id: row.get(0)?,
            nest_id: row.get(1)?,
            folder_id: row.get(2)?,
            nestling_type: row.get(3)?,
            icon: row.get(4)?,
            is_pinned: row.get(5)?,
            title: row.get(6)?,
            content: row.get(7)?,
            created_at: row.get(8)?,
            updated_at: row.get(9)?,
        })
    }
}
