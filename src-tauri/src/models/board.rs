use serde::{Deserialize, Serialize};

use crate::models::nestling::Nestling;

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NewBoardColumn {
    pub nestling_id: i64,
    pub title: String,
    pub order_index: i64,
    pub color: String,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BoardColumn {
    pub id: i64,
    pub nestling_id: i64,
    pub title: String,
    pub order_index: i64,
    pub color: String,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NewBoardCard {
    pub column_id: i64,
    pub title: String,
    pub description: Option<String>,
    pub order_index: i64,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BoardCard {
    pub id: i64,
    pub column_id: i64,
    pub title: String,
    pub description: Option<String>,
    pub order_index: i64,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BoardData {
    pub nestling: Nestling,
    pub columns: Vec<BoardColumnData>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BoardColumnData {
    pub column: BoardColumn,
    pub cards: Vec<BoardCard>,
}

impl TryFrom<&rusqlite::Row<'_>> for BoardColumn {
    type Error = rusqlite::Error;

    fn try_from(row: &rusqlite::Row<'_>) -> Result<Self, Self::Error> {
        Ok(BoardColumn {
            id: row.get(0)?,
            nestling_id: row.get(1)?,
            title: row.get(2)?,
            order_index: row.get(3)?,
            color: row.get(4)?,
            created_at: row.get(5)?,
            updated_at: row.get(6)?,
        })
    }
}

impl TryFrom<&rusqlite::Row<'_>> for BoardCard {
    type Error = rusqlite::Error;

    fn try_from(row: &rusqlite::Row<'_>) -> Result<Self, Self::Error> {
        Ok(BoardCard {
            id: row.get(0)?,
            column_id: row.get(1)?,
            title: row.get(2)?,
            description: row.get(3)?,
            order_index: row.get(4)?,
            created_at: row.get(5)?,
            updated_at: row.get(6)?,
        })
    }
}
