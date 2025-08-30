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
use handler::nestling::delete_nestling;
use handler::nestling::delete_folder;

use handler::note::edit_note;

use handler::board::create_board_column;
use handler::board::update_board_column;
use handler::board::delete_board_column;
use handler::board::create_board_card;
use handler::board::update_board_card;
use handler::board::delete_board_card;
use handler::board::get_board_data;

use handler::calendar::create_event;
use handler::calendar::update_event;
use handler::calendar::delete_event;
use handler::calendar::get_events;

use handler::journal::insert_journal_entry;
use handler::journal::get_journal_entries;
use handler::journal::update_journal_entry;
use handler::journal::delete_journal_entry;
use handler::journal::insert_journal_template;
use handler::journal::get_journal_templates;
use handler::journal::update_journal_template;
use handler::journal::delete_journal_template;

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
            get_events,
            insert_journal_entry,
            get_journal_entries,
            update_journal_entry,
            delete_journal_entry,
            insert_journal_template,
            get_journal_templates,
            update_journal_template,
            delete_journal_template]
        )
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
