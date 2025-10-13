use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct NewJournalEntry {
    pub nestling_id: i64,
    pub title: String,
    pub content: String,
    pub entry_date: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct JournalEntry {
    pub id: i64,
    pub nestling_id: i64,
    pub title: String,
    pub content: String,
    pub entry_date: String,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct NewJournalTemplate {
    pub nestling_id: i64,
    pub name: String,
    pub content: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct JournalTemplate {
    pub id: i64,
    pub nestling_id: i64,
    pub name: String,
    pub content: String,
    pub created_at: String,
    pub updated_at: String,
}