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
            get_nest_by_id]
        )
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
