use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NewBackgroundMusic {
    pub nest_id: i64,
    pub title: String,
    pub file_path: String,
    pub duration_seconds: i64,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct BackgroundMusic {
    pub id: i64,
    pub nest_id: i64,
    pub title: String,
    pub file_path: String,
    pub duration_seconds: i64,
    pub created_at: String,
    pub updated_at: String,
}

impl TryFrom<&rusqlite::Row<'_>> for BackgroundMusic {
    type Error = rusqlite::Error;

    fn try_from(row: &rusqlite::Row<'_>) -> Result<Self, Self::Error> {
        Ok(BackgroundMusic {
            id: row.get(0)?,
            nest_id: row.get(1)?,
            title: row.get(2)?,
            file_path: row.get(3)?,
            duration_seconds: row.get(4)?,
            created_at: row.get(5)?,
            updated_at: row.get(6)?,
        })
    }
}
