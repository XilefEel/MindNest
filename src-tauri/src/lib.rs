mod db;
mod handler;
mod models;
mod utils;

use handler::nest::{create_nest, delete_nest, get_nest_by_id, get_user_nests, update_nest};

use handler::nestling::{
    create_nestling, get_nestlings, update_nestling, delete_nestling,
    create_folder, get_folders, update_folder, delete_folder
};

use handler::nest_background::{
    add_background, import_background, get_backgrounds, delete_background,
};

use handler::user::{login_user, signup_user};

use handler::note::edit_note;

use handler::board::{
    create_board_card, create_board_column, delete_board_card, delete_board_column, get_board_data,
    update_board_card, update_board_column,
};
use handler::calendar::{create_event, delete_event, get_events, update_event};
use handler::journal::{
    delete_journal_entry, delete_journal_template, get_journal_entries, get_journal_templates,
    insert_journal_entry, insert_journal_template, update_journal_entry, update_journal_template,
};

use handler::gallery::{
    create_album, delete_album, delete_image, get_albums,
    get_images, add_image, import_image, import_image_data, update_album, update_image,
    download_image, download_album, duplicate_image
};

use utils::user::init_db;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    init_db().expect("Failed to initialize DB");
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .invoke_handler(tauri::generate_handler![
            // Auth
            signup_user,
            login_user,
            
            // Nests
            create_nest,
            get_user_nests,
            update_nest,
            delete_nest,
            get_nest_by_id,
            
            // Nestlings & Folders
            create_nestling,
            get_nestlings,
            update_nestling,
            delete_nestling,
            create_folder,
            get_folders,
            update_folder,
            delete_folder,

            // Notes
            edit_note,
            
            // Board
            create_board_column,
            update_board_column,
            delete_board_column,
            create_board_card,
            update_board_card,
            delete_board_card,
            get_board_data,
            
            // Calendar
            create_event,
            update_event,
            delete_event,
            get_events,
            
            // Journal
            insert_journal_entry,
            get_journal_entries,
            update_journal_entry,
            delete_journal_entry,
            insert_journal_template,
            get_journal_templates,
            update_journal_template,
            delete_journal_template,
            
            // Gallery
            add_image,
            import_image,
            import_image_data,
            download_image,
            download_album,
            duplicate_image,
            get_images,
            update_image,
            delete_image,
            create_album,
            get_albums,
            update_album,
            delete_album,
            
            // Background Images
            import_background,
            add_background,
            get_backgrounds,
            delete_background,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
