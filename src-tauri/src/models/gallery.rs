use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NewGalleryAlbum {
    pub nestling_id: i64,
    pub name: String,
    pub description: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GalleryAlbum {
    pub id: i64,
    pub nestling_id: i64,
    pub name: String,
    pub description: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
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

#[derive(Debug, Serialize, Deserialize)]
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
