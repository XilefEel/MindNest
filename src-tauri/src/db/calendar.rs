use crate::models::nestling::{NewPlannerEvent, PlannerEvent};
use crate::utils::user::get_connection;
use rusqlite::params;

use chrono;

pub fn insert_planner_event_into_db(data: NewPlannerEvent) -> Result<PlannerEvent, String> {
    let connection = get_connection().map_err(|e| e.to_string())?;

    let created_at = chrono::Local::now()
        .naive_local()
        .format("%Y-%m-%d %H:%M:%S")
        .to_string();

    let mut statement = connection.prepare(
        "INSERT INTO planner_events 
         (nestling_id, date, title, description, start_time, duration, color, created_at, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)
         RETURNING id, nestling_id, date, title, description, start_time, duration, color, created_at, updated_at"
    ).map_err(|e| e.to_string())?;

    let event = statement
        .query_row(
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
            },
        )
        .map_err(|e| e.to_string())?;

    println!("{:?}", event);
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
    let updated_at = chrono::Local::now()
        .naive_local()
        .format("%Y-%m-%d %H:%M:%S")
        .to_string();

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

    connection
        .execute("DELETE FROM planner_events WHERE id = ?1", params![id])
        .map_err(|e| e.to_string())?;

    Ok(())
}

pub fn get_planner_events_from_range(
    nestling_id: i64,
    start: String,
    end: String,
) -> Result<Vec<PlannerEvent>, String> {
    let connection = get_connection().map_err(|e| e.to_string())?;

    let mut statement = connection.prepare(
        "SELECT id, nestling_id, date, title, description, start_time, duration, color, created_at, updated_at
         FROM planner_events
         WHERE nestling_id = ?1 AND date BETWEEN ?2 AND ?3
         ORDER BY date, start_time"
    ).map_err(|e| e.to_string())?;

    let events = statement
        .query_map(params![nestling_id, start, end], |row| {
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
    println!("{:?}", events);
    Ok(events)
}
