use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NewBookmark {
    pub nestling_id: i64,
    pub url: String,
    pub title: Option<String>,
    pub description: Option<String>,
    pub image_url: Option<String>,
    pub is_favorite: bool,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Bookmark {
    pub id: i64,
    pub nestling_id: i64,
    pub url: String,
    pub title: Option<String>,
    pub description: Option<String>,
    pub image_url: Option<String>,
    pub is_favorite: bool,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct BookmarkMetadata {
    pub title: Option<String>,
    pub description: Option<String>,
    pub image_url: Option<String>,
}

impl TryFrom<&rusqlite::Row<'_>> for Bookmark {
    type Error = rusqlite::Error;

    fn try_from(row: &rusqlite::Row<'_>) -> Result<Self, Self::Error> {
        Ok(Bookmark {
            id: row.get(0)?,
            nestling_id: row.get(1)?,
            url: row.get(2)?,
            title: row.get(3)?,
            description: row.get(4)?,
            image_url: row.get(5)?,
            is_favorite: row.get(6)?,
            created_at: row.get(7)?,
            updated_at: row.get(8)?,
        })
    }
}
