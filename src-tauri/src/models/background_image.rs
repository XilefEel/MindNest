use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NewBackgroundImage {
    pub nest_id: i64,
    pub file_path: String,
    pub is_selected: bool,
    pub width: i64,
    pub height: i64,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
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

impl TryFrom<&rusqlite::Row<'_>> for BackgroundImage {
    type Error = rusqlite::Error;

    fn try_from(row: &rusqlite::Row<'_>) -> Result<Self, Self::Error> {
        Ok(BackgroundImage {
            id: row.get(0)?,
            nest_id: row.get(1)?,
            file_path: row.get(2)?,
            is_selected: row.get(3)?,
            width: row.get(4)?,
            height: row.get(5)?,
            created_at: row.get(6)?,
            updated_at: row.get(7)?,
        })
    }
}
