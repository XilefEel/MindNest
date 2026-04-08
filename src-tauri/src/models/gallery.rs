use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NewGalleryImage {
    pub nestling_id: i64,
    pub file_path: String,
    pub title: Option<String>,
    pub description: Option<String>,
    pub is_favorite: bool,
    pub width: i64,
    pub height: i64,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct GalleryImage {
    pub id: i64,
    pub nestling_id: i64,
    pub file_path: String,
    pub title: Option<String>,
    pub description: Option<String>,
    pub is_favorite: bool,
    pub width: i64,
    pub height: i64,
    pub created_at: String,
    pub updated_at: String,
}

impl TryFrom<&rusqlite::Row<'_>> for GalleryImage {
    type Error = rusqlite::Error;

    fn try_from(row: &rusqlite::Row<'_>) -> Result<Self, Self::Error> {
        Ok(GalleryImage {
            id: row.get(0)?,
            nestling_id: row.get(1)?,
            file_path: row.get(2)?,
            title: row.get(3)?,
            description: row.get(4)?,
            is_favorite: row.get(5)?,
            width: row.get(6)?,
            height: row.get(7)?,
            created_at: row.get(8)?,
            updated_at: row.get(9)?,
        })
    }
}
