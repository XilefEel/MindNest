use crate::db::calendar::{
    delete_planner_event_from_db, get_planner_events_from_range, insert_planner_event_into_db,
    update_planner_event_in_db,
};
use crate::models::calendar::{NewPlannerEvent, PlannerEvent};
use crate::utils::db::AppDb;

#[tauri::command]
pub fn create_event(
    db: tauri::State<AppDb>,
    data: NewPlannerEvent,
) -> Result<PlannerEvent, String> {
    insert_planner_event_into_db(&db, data)
}

#[tauri::command]
pub fn update_event(
    db: tauri::State<AppDb>,
    id: i64,
    date: String,
    title: String,
    description: Option<String>,
    start_time: i64,
    duration: i64,
    color: Option<String>,
) -> Result<(), String> {
    update_planner_event_in_db(
        &db,
        id,
        date,
        title,
        description,
        start_time,
        duration,
        color,
    )
}

#[tauri::command]
pub fn delete_event(db: tauri::State<AppDb>, id: i64) -> Result<(), String> {
    delete_planner_event_from_db(&db, id)
}

#[tauri::command]
pub fn get_events(
    db: tauri::State<AppDb>,
    nestling_id: i64,
    start: String,
    end: String,
) -> Result<Vec<PlannerEvent>, String> {
    get_planner_events_from_range(&db, nestling_id, start, end)
}
