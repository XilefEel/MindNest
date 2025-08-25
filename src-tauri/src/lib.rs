mod handler;
mod db;
mod models;
mod utils;

use handler::user::signup_user;
use handler::user::login_user;
use handler::nest::create_nest;
use handler::nest::get_user_nests;
use handler::nest::update_nest;
use handler::nest::delete_nest;
use handler::nest::get_nest_by_id;
use handler::nestling::create_nestling;
use handler::nestling::create_folder;
use handler::nestling::get_nestlings;
use handler::nestling::get_folders;
use handler::nestling::update_folder;
use handler::nestling::edit_note;
use handler::nestling::delete_nestling;
use handler::nestling::delete_folder;
use handler::nestling::create_board_column;
use handler::nestling::update_board_column;
use handler::nestling::delete_board_column;
use handler::nestling::create_board_card;
use handler::nestling::update_board_card;
use handler::nestling::delete_board_card;
use handler::nestling::get_board_data;
use handler::nestling::create_event;
use handler::nestling::update_event;
use handler::nestling::delete_event;
use handler::nestling::get_events;

use utils::user::init_db;



#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    init_db().expect("Failed to initialize DB");
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .invoke_handler(tauri::generate_handler![
            signup_user,
            login_user,
            create_nest,
            get_user_nests,
            update_nest,
            delete_nest,
            get_nest_by_id,
            create_nestling,
            create_folder,
            get_nestlings,
            get_folders,
            update_folder,
            edit_note,
            delete_nestling,
            delete_folder,
            create_board_column,
            update_board_column,
            delete_board_column,
            create_board_card,
            update_board_card,
            delete_board_card,
            get_board_data,
            create_event,
            update_event,
            delete_event,
            get_events]
        )
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
