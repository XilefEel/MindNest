use serde::{Deserialize, Serialize};

// #[derive(Debug, Serialize, Deserialize)]
// #[serde(rename_all = "camelCase")]
// pub struct NewGalleryAlbum {
//     pub nestling_id: i64,
//     pub name: String,
//     pub description: Option<String>,
// }

// #[derive(Debug, Serialize, Deserialize)]
// #[serde(rename_all = "camelCase")]
// pub struct GalleryAlbum {
//     pub id: i64,
//     pub nestling_id: i64,
//     pub name: String,
//     pub description: Option<String>,
//     pub created_at: String,
//     pub updated_at: String,
// }

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NewGalleryImage {
    pub album_id: Option<i64>,
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
    pub album_id: Option<i64>,
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
            album_id: row.get(1)?,
            nestling_id: row.get(2)?,
            file_path: row.get(3)?,
            title: row.get(4)?,
            description: row.get(5)?,
            is_favorite: row.get(6)?,
            width: row.get(7)?,
            height: row.get(8)?,
            created_at: row.get(9)?,
            updated_at: row.get(10)?,
        })
    }
}
