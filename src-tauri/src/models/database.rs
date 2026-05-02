use crate::models::nestling::Nestling;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NewDbColumn {
    pub nestling_id: i64,
    pub title: String,
    pub column_type: String,
    pub order_index: i64,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DbColumn {
    pub id: i64,
    pub nestling_id: i64,
    pub name: String,
    pub column_type: String,
    pub order_index: i64,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NewDbRow {
    pub nestling_id: i64,
    pub order_index: i64,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DbRow {
    pub id: i64,
    pub nestling_id: i64,
    pub order_index: i64,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NewDbCell {
    pub row_id: i64,
    pub column_id: i64,
    pub value: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DbCell {
    pub id: i64,
    pub row_id: i64,
    pub column_id: i64,
    pub value: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DbData {
    pub nestling: Nestling,
    pub columns: Vec<DbColumn>,
    pub rows: Vec<DbRowData>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DbRowData {
    pub row: DbRow,
    pub cells: Vec<DbCell>,
}

impl TryFrom<&rusqlite::Row<'_>> for DbColumn {
    type Error = rusqlite::Error;
    fn try_from(row: &rusqlite::Row<'_>) -> Result<Self, Self::Error> {
        Ok(DbColumn {
            id: row.get(0)?,
            nestling_id: row.get(1)?,
            name: row.get(2)?,
            column_type: row.get(3)?,
            order_index: row.get(4)?,
            created_at: row.get(5)?,
            updated_at: row.get(6)?,
        })
    }
}

impl TryFrom<&rusqlite::Row<'_>> for DbRow {
    type Error = rusqlite::Error;
    fn try_from(row: &rusqlite::Row<'_>) -> Result<Self, Self::Error> {
        Ok(DbRow {
            id: row.get(0)?,
            nestling_id: row.get(1)?,
            order_index: row.get(2)?,
            created_at: row.get(3)?,
            updated_at: row.get(4)?,
        })
    }
}

impl TryFrom<&rusqlite::Row<'_>> for DbCell {
    type Error = rusqlite::Error;
    fn try_from(row: &rusqlite::Row<'_>) -> Result<Self, Self::Error> {
        Ok(DbCell {
            id: row.get(0)?,
            row_id: row.get(1)?,
            column_id: row.get(2)?,
            value: row.get(3)?,
            created_at: row.get(4)?,
            updated_at: row.get(5)?,
        })
    }
}
