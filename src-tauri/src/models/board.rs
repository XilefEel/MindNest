use serde::{Deserialize, Serialize};

use crate::models::nestling::Nestling;

#[derive(Serialize, Deserialize)]
pub struct NewBoardColumn {
    pub nestling_id: i64,
    pub title: String,
    pub order_index: i64,
    pub color: String,
}

#[derive(Debug, Serialize, Deserialize)]
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
pub struct NewBoardCard {
    pub column_id: i64,
    pub title: String,
    pub description: Option<String>,
    pub order_index: i64,
}

#[derive(Debug, Serialize, Deserialize)]
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
pub struct BoardData {
    pub nestling: Nestling,
    pub columns: Vec<BoardColumnData>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct BoardColumnData {
    pub column: BoardColumn,
    pub cards: Vec<BoardCard>,
}
