use crate::db::calendar::{
    delete_planner_event_from_db, get_planner_events_from_range, insert_planner_event_into_db,
    update_planner_event_in_db,
};
use crate::models::nestling::{NewPlannerEvent, PlannerEvent};

#[tauri::command]
pub fn create_event(data: NewPlannerEvent) -> Result<PlannerEvent, String> {
    println!("Adding event: {:#?}", data);
    insert_planner_event_into_db(data)
}

#[tauri::command]
pub fn update_event(
    id: i64,
    date: String,
    title: String,
    description: Option<String>,
    start_time: i64,
    duration: i64,
    color: Option<String>,
) -> Result<(), String> {
    update_planner_event_in_db(id, date, title, description, start_time, duration, color)
}

#[tauri::command]
pub fn delete_event(id: i64) -> Result<(), String> {
    delete_planner_event_from_db(id)
}

#[tauri::command]
pub fn get_events(
    nestling_id: i64,
    start: String,
    end: String,
) -> Result<Vec<PlannerEvent>, String> {
    println!(
        "Getting events for nestling {} between {} and {}",
        nestling_id, start, end
    );
    get_planner_events_from_range(nestling_id, start, end)
}
