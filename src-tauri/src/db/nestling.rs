use crate::models::nestling::{BoardCard, BoardColumn, BoardColumnData, BoardData, Folder, Nestling, NewBoardCard, NewBoardColumn, NewFolder, NewNestling, NewPlannerEvent, PlannerEvent};
use crate::utils::user::get_connection;
use rusqlite::params;
use std::collections::HashMap;

use chrono;

pub fn insert_nestling_into_db(data: NewNestling) -> Result<(), String> {
    let connection = get_connection().map_err(|e| e.to_string())?;

    let created_at = chrono::Local::now().naive_local().format("%Y-%m-%d %H:%M:%S").to_string();

    connection.execute(
        "INSERT INTO nestlings (nest_id, folder_id, type, title, content, created_at, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)",
        params![
            data.nest_id,
            data.folder_id,
            data.nestling_type,
            data.title,
            data.content,   
            created_at,
            created_at
        ],
    ).map_err(|e| e.to_string())?;
    Ok(())
}

pub fn get_nestlings_by_nest(nest_id: i32) -> Result<Vec<Nestling>, String> {
    let connection = get_connection().map_err(|e| e.to_string())?;

    let mut statement = connection.prepare(
        "SELECT id, nest_id, folder_id, type, title, content, created_at, updated_at 
         FROM nestlings 
         WHERE nest_id = ?1 
         ORDER BY updated_at DESC"
    ).map_err(|e| e.to_string())?;

    let rows = statement.query_map([nest_id], |row| {
        Ok(Nestling {
            id: row.get(0)?,
            nest_id: row.get(1)?,
            folder_id: row.get(2)?,
            nestling_type: row.get(3)?,
            title: row.get(4)?,
            content: row.get(5)?,
            created_at: row.get(6)?,
            updated_at: row.get(7)?,
        })
    }).map_err(|e| e.to_string())?;

    let result = rows.collect::<Result<Vec<Nestling>, _>>().map_err(|e| e.to_string())?;
    Ok(result)


}

pub fn get_nestling_by_id(nestling_id: i64) -> Result<Nestling, String> {
    let connection = get_connection().map_err(|e| e.to_string())?;
    let mut statement = connection.prepare(
        "SELECT id, nest_id, folder_id, title, type, content, created_at, updated_at
         FROM nestlings
         WHERE id = ?1"
    ).map_err(|e| e.to_string())?;

    let result = statement.query_row([nestling_id], |row| {
        Ok(Nestling {
            id: row.get(0)?,
            nest_id: row.get(1)?,
            folder_id: row.get(2)?,
            nestling_type: row.get(3)?,
            title: row.get(4)?,
            content: row.get(5)?,
            created_at: row.get(6)?,
            updated_at: row.get(7)?,
        })
    }).map_err(|e| e.to_string())?;
    Ok(result)
}

pub fn insert_folder_into_db(data: NewFolder) -> Result<(), String> {
    let connection = get_connection().map_err(|e| e.to_string())?;

    let created_at = chrono::Local::now().naive_local().format("%Y-%m-%d %H:%M:%S").to_string();

    connection.execute(
        "INSERT INTO folders (nest_id, name, created_at, updated_at)
         VALUES (?1, ?2, ?3, ?4)",
        params![
            data.nest_id,
            data.name,
            created_at,
            created_at
        ],
    ).map_err(|e| e.to_string())?;
    Ok(())
}

pub fn get_folders_by_nest(nest_id: i32) -> Result<Vec<Folder>, String> {
    let connection = get_connection().map_err(|e| e.to_string())?;

    let mut statement = connection.prepare(
        "SELECT id, nest_id, name, created_at, updated_at 
         FROM folders 
         WHERE nest_id = ?1 
         ORDER BY updated_at DESC"
    ).map_err(|e| e.to_string())?;

    let rows = statement.query_map([nest_id], |row| {
        Ok(Folder {
            id: row.get(0)?,
            nest_id: row.get(1)?,
            name: row.get(2)?,
            created_at: row.get(3)?,
            updated_at: row.get(4)?,
        })
    }).map_err(|e| e.to_string())?;

    let result = rows.collect::<Result<Vec<Folder>, _>>().map_err(|e| e.to_string())?;
    Ok(result)
}

pub fn update_nestling_folder(id: i64, folder_id: Option<i64>) -> Result<(), String> {
    let conn = get_connection().map_err(|e| e.to_string())?;

    conn.execute(
        "UPDATE nestlings SET folder_id = ?1, updated_at = CURRENT_TIMESTAMP WHERE id = ?2",
        params![folder_id, id],
    ).map_err(|e| e.to_string())?;

    Ok(())
}

pub fn update_note(
    id: i64,
    title: Option<String>,
    content: Option<String>
) -> Result<(), String> {
    let conn = get_connection().map_err(|e| e.to_string())?;
    
    if title.is_some() && content.is_some() {
    conn.execute(
        "UPDATE nestlings SET title = ?1, content = ?2 WHERE id = ?3",
        params![title.unwrap(), content.unwrap(), &id]
        ).map_err(|e| e.to_string())?;
    } else if let Some(title) = title {
    conn.execute(
        "UPDATE nestlings SET title = ?1 WHERE id = ?2",
        params![title, &id]
        ).map_err(|e| e.to_string())?;
    } else if let Some(content) = content {
    conn.execute(
        "UPDATE nestlings SET content = ?1 WHERE id = ?2",
        params![content, &id]
        ).map_err(|e| e.to_string())?;
    }

    Ok(())
}

pub fn delete_nestling_from_db(id: i64) -> Result<(), String> {
    let conn = get_connection().map_err(|e| e.to_string())?;

    conn.execute(
        "DELETE FROM nestlings WHERE id = ?1",
        params![id],
    ).map_err(|e| e.to_string())?;

    Ok(())
}

pub fn delete_folder_from_db(id: i64) -> Result<(), String> {
    let conn = get_connection().map_err(|e| e.to_string())?;

    conn.execute(
        "DELETE FROM folders WHERE id = ?1",
        params![id],
    ).map_err(|e| e.to_string())?;

    Ok(())
}


pub fn insert_board_column_into_db(data: NewBoardColumn) -> Result<BoardColumn, String> {
    let connection = get_connection().map_err(|e| e.to_string())?;

    let created_at = chrono::Local::now().naive_local().format("%Y-%m-%d %H:%M:%S").to_string();

    let mut statement = connection.prepare(
        "INSERT INTO board_columns (nestling_id, title, order_index, created_at, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5)
         RETURNING id, nestling_id, title, order_index, created_at, updated_at"
    ).map_err(|e| e.to_string())?;

    let column = statement.query_row(
        params![
            data.nestling_id,
            data.title,
            data.order_index,
            created_at,
            created_at
        ], |row| {
            Ok(BoardColumn {
                id: row.get(0)?,
                nestling_id: row.get(1)?,
                title: row.get(2)?,
                order_index: row.get(3)?,
                created_at: row.get(4)?,
                updated_at: row.get(5)?,
            })
        }
    ).map_err(|e| e.to_string())?;
    Ok(column)
}

pub fn update_board_column_in_db(id: i64, title: String, order_index: i64) -> Result<(), String> {
    let connection = get_connection().map_err(|e| e.to_string())?;
    
    connection.execute(
        "UPDATE board_columns SET title = ?1, order_index = ?2, updated_at = CURRENT_TIMESTAMP WHERE id = ?3",
        params![title, order_index, id],
    ).map_err(|e| e.to_string())?;
    Ok(())
}

pub fn delete_board_column_from_db(id: i64) -> Result<(), String> {
    let connection = get_connection().map_err(|e| e.to_string())?;

    connection.execute(
        "DELETE FROM board_columns WHERE id = ?1",
        params![id],
    ).map_err(|e| e.to_string())?;

    Ok(())
}


pub fn insert_board_card_into_db(data: NewBoardCard) -> Result<BoardCard, String> {
    let connection = get_connection().map_err(|e| e.to_string())?;

    let created_at = chrono::Local::now().naive_local().format("%Y-%m-%d %H:%M:%S").to_string();

    let mut statement = connection.prepare(
        "INSERT INTO board_cards (column_id, title, description, order_index, created_at, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6)
         RETURNING id, column_id, title, description, order_index, created_at, updated_at"
    ).map_err(|e| e.to_string())?;

    let card = statement.query_row(
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
        }
    ).map_err(|e| e.to_string())?;
    Ok(card)
}

pub fn update_board_card_in_db(
    id: i64,
    title: String,
    description: Option<String>,
    order_index: i64,
    column_id: i64,
) -> Result<(), String> {
    let connection = get_connection().map_err(|e| e.to_string())?;
    
    connection.execute(
        "UPDATE board_cards 
         SET title = ?1, description = ?2, order_index = ?3, column_id = ?4, updated_at = CURRENT_TIMESTAMP 
         WHERE id = ?5",
        params![title, description, order_index, column_id, id],
    ).map_err(|e| e.to_string())?;
    
    Ok(())
}


pub fn delete_board_card_from_db(id: i64) -> Result<(), String> {
    let connection = get_connection().map_err(|e| e.to_string())?;

    connection.execute(
        "DELETE FROM board_cards WHERE id = ?1",
        params![id],
    ).map_err(|e| e.to_string())?;
    Ok(())
}


fn get_board_columns_by_nestling(nestling_id: i64) -> Result<Vec<BoardColumn>, String>{
    let connection = get_connection().map_err(|e| e.to_string())?;
    
    let mut statement = connection.prepare(
            "SELECT id, nestling_id, title, order_index, created_at, updated_at
             FROM board_columns
             WHERE nestling_id = ?1
             ORDER BY order_index ASC",
        )
        .map_err(|e| e.to_string())?;
    
    let columns = statement.query_map([nestling_id], |row| {
        Ok(BoardColumn {
            id: row.get(0)?,
            nestling_id: row.get(1)?,
            title: row.get(2)?,
            order_index: row.get(3)?,
            created_at: row.get(4)?,
            updated_at: row.get(5)?,
        })
    }).map_err(|e| e.to_string())?;

    let result = columns.collect::<Result<Vec<BoardColumn>, _>>().map_err(|e| e.to_string())?;
    Ok(result)
}

fn get_all_cards_by_nestling(nestling_id: i64) -> Result<Vec<BoardCard>, String> {
    let connection = get_connection().map_err(|e| e.to_string())?;
    
    let mut statement = connection.prepare(
        "SELECT cards.id, cards.column_id, cards.title, cards.description, 
                cards.order_index, cards.created_at, cards.updated_at
         FROM board_cards cards
         JOIN board_columns columns ON cards.column_id = columns.id
         WHERE columns.nestling_id = ?1
         ORDER BY columns.order_index ASC, cards.order_index ASC"
    ).map_err(|e| e.to_string())?;

    let cards = statement.query_map([nestling_id], |row| {
        Ok(BoardCard {
            id: row.get(0)?,
            column_id: row.get(1)?,
            title: row.get(2)?,
            description: row.get(3)?,
            order_index: row.get(4)?,
            created_at: row.get(5)?,
            updated_at: row.get(6)?,
        })
    }).map_err(|e| e.to_string())?;

    let result = cards.collect::<Result<Vec<BoardCard>, _>>().map_err(|e| e.to_string())?;
    Ok(result)
}

pub fn get_board_data_from_db(nestling_id: i64) -> Result<BoardData, String> {
    let nestling = get_nestling_by_id(nestling_id)?;
    let columns = get_board_columns_by_nestling(nestling_id)?;
    let all_cards = get_all_cards_by_nestling(nestling_id)?;

    let mut cards_by_column: HashMap<i64, Vec<BoardCard>> = HashMap::new();
    for card in all_cards {
        cards_by_column
            .entry(card.column_id)
            .or_insert_with(Vec::new)
            .push(card);
    }
    
    // Build the final structure, preserving column order
    let mut column_data_list = Vec::new();
    for col in columns {
        let mut cards = cards_by_column
            .remove(&col.id)
            .unwrap_or_else(Vec::new);
            
        // Sort cards by order_index to maintain correct order within each column
        cards.sort_by_key(|card| card.order_index);
            
        column_data_list.push(BoardColumnData {
            column: col,
            cards,
        });
    }

    Ok(BoardData {
        nestling,
        columns: column_data_list,
    })
}


pub fn insert_planner_event_into_db(data: NewPlannerEvent) -> Result<PlannerEvent, String> {
    let connection = get_connection().map_err(|e| e.to_string())?;

    let created_at = chrono::Local::now().naive_local().format("%Y-%m-%d %H:%M:%S").to_string();

    let mut statement = connection.prepare(
        "INSERT INTO planner_events 
         (nestling_id, date, title, description, start_time, duration, created_at, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)
         RETURNING id, nestling_id, date, title, description, start_time, duration, color, created_at, updated_at"
    ).map_err(|e| e.to_string())?;

    let event = statement.query_row(
        params![
            data.nestling_id,
            data.date,
            data.title,
            data.description,
            data.start_time,
            data.duration,
            data.color,
            created_at,
            created_at
        ], 
        |row| {
            Ok(PlannerEvent {
                id: row.get(0)?,
                nestling_id: row.get(1)?,
                date: row.get(2)?,
                title: row.get(3)?,
                description: row.get(4)?,
                start_time: row.get(5)?,
                duration: row.get(6)?,
                color: row.get(7)?,
                created_at: row.get(8)?,
                updated_at: row.get(9)?,
            })
        }
    ).map_err(|e| e.to_string())?;

    Ok(event)
}

pub fn update_planner_event_in_db(
    id: i64,
    date: String,
    title: String,
    description: Option<String>,
    start_time: i64,
    duration: i64,
    color: Option<String>,
) -> Result<(), String> {
    let connection = get_connection().map_err(|e| e.to_string())?;
    let updated_at = chrono::Local::now().naive_local().format("%Y-%m-%d %H:%M:%S").to_string();

    connection.execute(
        "UPDATE planner_events
         SET date = ?1, title = ?2, description = ?3, start_time = ?4, duration = ?5, color = ?6, updated_at = ?7
         WHERE id = ?8",
        params![date, title, description, start_time, duration, color, updated_at, id]
    ).map_err(|e| e.to_string())?;

    Ok(())
}

pub fn delete_planner_event_from_db(id: i64) -> Result<(), String> {
    let connection = get_connection().map_err(|e| e.to_string())?;

    connection.execute(
        "DELETE FROM planner_events WHERE id = ?1",
        params![id]
    ).map_err(|e| e.to_string())?;

    Ok(())
}

pub fn get_planner_events_for_week(nestling_id: i64, week_start: String, week_end: String) -> Result<Vec<PlannerEvent>, String> {
    let connection = get_connection().map_err(|e| e.to_string())?;

    let mut statement = connection.prepare(
        "SELECT id, nestling_id, date, title, description, start_time, duration, color, created_at, updated_at
         FROM planner_events
         WHERE nestling_id = ?1 AND date BETWEEN ?2 AND ?3
         ORDER BY date, start_time"
    ).map_err(|e| e.to_string())?;

    let events = statement
        .query_map(params![nestling_id, week_start, week_end], |row| {
            Ok(PlannerEvent {
                id: row.get(0)?,
                nestling_id: row.get(1)?,
                date: row.get(2)?,
                title: row.get(3)?,
                description: row.get(4)?,
                start_time: row.get(5)?,
                duration: row.get(6)?,
                color: row.get(7)?,
                created_at: row.get(8)?,
                updated_at: row.get(9)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(events)
}
