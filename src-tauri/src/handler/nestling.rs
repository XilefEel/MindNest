use crate::models::nestling::{BoardCard, BoardColumn, BoardData, Folder, Nestling, NewBoardCard, NewBoardColumn, NewFolder, NewNestling, NewPlannerEvent, PlannerEvent};
use crate::db::nestling::{
    delete_board_card_from_db, delete_board_column_from_db, delete_folder_from_db, delete_nestling_from_db, delete_planner_event_from_db, get_board_data_from_db, get_folders_by_nest, get_nestlings_by_nest, get_planner_events_for_week, insert_board_card_into_db, insert_board_column_into_db, insert_folder_into_db, insert_nestling_into_db, insert_planner_event_into_db, update_board_card_in_db, update_board_column_in_db, update_nestling_folder, update_note, update_planner_event_in_db
};

#[tauri::command]
pub fn create_nestling(data: NewNestling) -> Result<(), String> {
    insert_nestling_into_db(data)
}

#[tauri::command]
pub fn get_nestlings(nest_id: i32) -> Result<Vec<Nestling>, String> {
    get_nestlings_by_nest(nest_id)
}

#[tauri::command]
pub fn create_folder(data: NewFolder) -> Result<(), String> {
    insert_folder_into_db(data)
}

#[tauri::command]
pub fn get_folders(nest_id: i32) -> Result<Vec<Folder>, String> {
    get_folders_by_nest(nest_id)
}

#[tauri::command]
pub fn update_folder(id: i64, folder_id: Option<i64>) -> Result<(), String> {
    update_nestling_folder(id, folder_id)
}

#[tauri::command]
pub fn edit_note(id: i64, title: Option<String>, content: Option<String>) -> Result<(), String> {
    update_note(id, title, content)
}

#[tauri::command]
pub fn delete_nestling(id: i64) -> Result<(), String> {
    delete_nestling_from_db(id)
}

#[tauri::command]
pub fn delete_folder(id: i64) -> Result<(), String> {
    delete_folder_from_db(id)
}

#[tauri::command]
pub fn create_board_column(data: NewBoardColumn) -> Result<BoardColumn, String> {
    insert_board_column_into_db(data)
}

#[tauri::command]
pub fn update_board_column(id: i64, title: String, order_index: i64) -> Result<(), String> {
    update_board_column_in_db(id, title, order_index)
}

#[tauri::command]
pub fn delete_board_column(id: i64) -> Result<(), String> {
    delete_board_column_from_db(id)
}

#[tauri::command]
pub fn create_board_card(data: NewBoardCard) -> Result<BoardCard, String> {
    insert_board_card_into_db(data)
}

#[tauri::command]
pub fn update_board_card(id: i64, title: String, description: Option<String>, order_index: i64, column_id: i64) -> Result<(), String> {
    update_board_card_in_db(id, title, description, order_index, column_id)
}

#[tauri::command]
pub fn delete_board_card(id: i64) -> Result<(), String> {
    delete_board_card_from_db(id)
}

#[tauri::command]
pub fn get_board_data(nestling_id: i64) -> Result<BoardData, String> {
    get_board_data_from_db(nestling_id)
}

#[tauri::command]
pub fn create_event(data: NewPlannerEvent) -> Result<PlannerEvent, String>{
    println!("Adding event: {:#?}", data);
    insert_planner_event_into_db(data)
}

#[tauri::command]
pub fn update_event(id: i64,
    date: String,
    title: String,
    description: Option<String>,
    start_time: i64,
    duration: i64,
    color: Option<String>
) -> Result<(), String>{
    update_planner_event_in_db(id, date, title, description, start_time, duration, color)
}

#[tauri::command]
pub fn delete_event(id: i64) -> Result<(), String>{
    delete_planner_event_from_db(id)
}

#[tauri::command]
pub fn get_events(nestling_id: i64, week_start: String, week_end: String) -> Result<Vec<PlannerEvent>, String> {
    println!("Getting events for nestling {} between {} and {}", nestling_id, week_start, week_end);
    get_planner_events_for_week(nestling_id, week_start, week_end)
}