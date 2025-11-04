use crate::db::nestling::get_nestling_by_id;
use crate::models::board::{
    BoardCard, BoardColumn, BoardColumnData, BoardData, NewBoardCard, NewBoardColumn,
};
use crate::utils::db::AppDb;
use chrono::Utc;
use rusqlite::params;
use std::collections::HashMap;

pub fn insert_board_column_into_db(db: &AppDb, data: NewBoardColumn) -> Result<BoardColumn, String> {
    let connection = db.connection.lock().unwrap();
    let created_at = Utc::now().to_rfc3339();

    let mut statement = connection
        .prepare(
            "INSERT INTO board_columns (nestling_id, title, order_index, color, created_at, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6)
         RETURNING id, nestling_id, title, order_index, color, created_at, updated_at",
        )
        .map_err(|e| e.to_string())?;

    let column = statement
        .query_row(
            params![
                data.nestling_id,
                data.title,
                data.order_index,
                data.color,
                created_at,
                created_at
            ],
            |row| {
                Ok(BoardColumn {
                    id: row.get(0)?,
                    nestling_id: row.get(1)?,
                    title: row.get(2)?,
                    order_index: row.get(3)?,
                    color: row.get(4)?,
                    created_at: row.get(5)?,
                    updated_at: row.get(6)?,
                })
            },
        )
        .map_err(|e| e.to_string())?;
    Ok(column)
}

pub fn update_board_column_in_db(db: &AppDb, id: i64, title: String, order_index: i64, color: String) -> Result<(), String> {
    let connection = db.connection.lock().unwrap();
    let updated_at = Utc::now().to_rfc3339();

    connection.execute(
        "UPDATE board_columns SET title = ?1, order_index = ?2, color = ?3, updated_at = ?4 WHERE id = ?5",
        params![title, order_index, color, updated_at, id],
    ).map_err(|e| e.to_string())?;
    Ok(())
}

pub fn delete_board_column_from_db(db: &AppDb, id: i64) -> Result<(), String> {
    let connection = db.connection.lock().unwrap();

    connection
        .execute("DELETE FROM board_columns WHERE id = ?1", params![id])
        .map_err(|e| e.to_string())?;

    Ok(())
}

pub fn insert_board_card_into_db(db: &AppDb, data: NewBoardCard) -> Result<BoardCard, String> {
    let connection = db.connection.lock().unwrap();
    let created_at = Utc::now().to_rfc3339();

    let mut statement = connection.prepare(
        "INSERT INTO board_cards (column_id, title, description, order_index, created_at, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6)
         RETURNING id, column_id, title, description, order_index, created_at, updated_at"
    ).map_err(|e| e.to_string())?;

    let card = statement
        .query_row(
            params![
                data.column_id,
                data.title,
                data.description,
                data.order_index,
                created_at,
                created_at
            ],
            |row| {
                Ok(BoardCard {
                    id: row.get(0)?,
                    column_id: row.get(1)?,
                    title: row.get(2)?,
                    description: row.get(3)?,
                    order_index: row.get(4)?,
                    created_at: row.get(5)?,
                    updated_at: row.get(6)?,
                })
            },
        )
        .map_err(|e| e.to_string())?;
    Ok(card)
}

pub fn update_board_card_in_db(
    db: &AppDb, 
    id: i64,
    title: String,
    description: Option<String>,
    order_index: i64,
    column_id: i64,
) -> Result<(), String> {
    let connection = db.connection.lock().unwrap();
    let updated_at = Utc::now().to_rfc3339();

    connection.execute(
        "UPDATE board_cards 
         SET title = ?1, description = ?2, order_index = ?3, column_id = ?4, updated_at = ?5 
         WHERE id = ?6",
        params![title, description, order_index, column_id, updated_at, id],
    ).map_err(|e| e.to_string())?;

    Ok(())
}

pub fn delete_board_card_from_db(db: &AppDb, id: i64) -> Result<(), String> {
    let connection = db.connection.lock().unwrap();

    connection
        .execute("DELETE FROM board_cards WHERE id = ?1", params![id])
        .map_err(|e| e.to_string())?;
    Ok(())
}

fn get_board_columns_by_nestling(db: &AppDb, nestling_id: i64) -> Result<Vec<BoardColumn>, String> {
    let connection = db.connection.lock().unwrap();

    let mut statement = connection
        .prepare(
            "SELECT id, nestling_id, title, order_index, color, created_at, updated_at
             FROM board_columns
             WHERE nestling_id = ?1
             ORDER BY order_index ASC",
        )
        .map_err(|e| e.to_string())?;

    let columns = statement
        .query_map([nestling_id], |row| {
            Ok(BoardColumn {
                id: row.get(0)?,
                nestling_id: row.get(1)?,
                title: row.get(2)?,
                order_index: row.get(3)?,
                color: row.get(4)?,
                created_at: row.get(5)?,
                updated_at: row.get(6)?,
            })
        })
        .map_err(|e| e.to_string())?;

    let result = columns
        .collect::<Result<Vec<BoardColumn>, _>>()
        .map_err(|e| e.to_string())?;
    Ok(result)
}

fn get_all_cards_by_nestling(db: &AppDb, nestling_id: i64) -> Result<Vec<BoardCard>, String> {
    let connection = db.connection.lock().unwrap();

    let mut statement = connection
        .prepare(
            "SELECT cards.id, cards.column_id, cards.title, cards.description, 
                cards.order_index, cards.created_at, cards.updated_at
         FROM board_cards cards
         JOIN board_columns columns ON cards.column_id = columns.id
         WHERE columns.nestling_id = ?1
         ORDER BY columns.order_index ASC, cards.order_index ASC",
        )
        .map_err(|e| e.to_string())?;

    let cards = statement
        .query_map([nestling_id], |row| {
            Ok(BoardCard {
                id: row.get(0)?,
                column_id: row.get(1)?,
                title: row.get(2)?,
                description: row.get(3)?,
                order_index: row.get(4)?,
                created_at: row.get(5)?,
                updated_at: row.get(6)?,
            })
        })
        .map_err(|e| e.to_string())?;

    let result = cards
        .collect::<Result<Vec<BoardCard>, _>>()
        .map_err(|e| e.to_string())?;
    Ok(result)
}

pub fn get_board_data_from_db(db: &AppDb, nestling_id: i64) -> Result<BoardData, String> {
    let nestling = get_nestling_by_id(&db, nestling_id)?;
    let columns = get_board_columns_by_nestling(&db, nestling_id)?;
    let all_cards = get_all_cards_by_nestling(&db, nestling_id)?;

    let mut cards_by_column: HashMap<i64, Vec<BoardCard>> = HashMap::new();
    for card in all_cards {
        cards_by_column
            .entry(card.column_id)
            .or_insert_with(Vec::new)
            .push(card);
    }

    let mut column_data_list = Vec::new();
    for col in columns {
        let mut cards = cards_by_column.remove(&col.id).unwrap_or_else(Vec::new);
        cards.sort_by_key(|card| card.order_index);
        column_data_list.push(BoardColumnData { column: col, cards });
    }

    Ok(BoardData {
        nestling,
        columns: column_data_list,
    })
}
