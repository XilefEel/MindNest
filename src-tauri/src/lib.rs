mod db;
mod handler;
mod models;
mod utils;

use handler::nest::{create_nest, delete_nest, get_nest_by_id, get_user_nests, update_nest};
use tauri::Manager;

use handler::nestling::{
    create_nestling, delete_nestling, get_nestlings, update_nestling, update_nestling_timestamp,
};

use handler::folder::{create_folder, delete_folder, get_folders, update_folder};

use handler::background_image::{
    add_background, delete_background, get_backgrounds, import_background,
};

use handler::background_music::{add_music, delete_music, get_music, import_music, update_music};

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
    add_image, create_album, delete_album, delete_image, download_album, download_image,
    duplicate_image, get_albums, get_images, import_image, import_image_data, update_album,
    update_image,
};

use handler::mindmap::{
    create_edge, create_node, delete_edge, delete_node, get_edges, get_nodes, update_node,
};

use handler::bookmark::{
    create_bookmark, delete_bookmark, get_bookmarks, toggle_bookmark_favorite,
};

use handler::tag::{
    attach_tag, create_tag, delete_tag, detach_tag, get_all_nestling_tags, get_tags, update_tag,
};

use crate::utils::db::{init_db, AppDb};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_clipboard_manager::init())
        .setup(|app| {
            let db = AppDb::new("test.db").map_err(|e| {
                println!("Failed to create DB: {}", e);
                format!("Failed to open database: {}", e)
            })?;
            init_db(&db).map_err(|e| {
                println!("Failed to init DB: {}", e);
                format!("Failed to initialize database: {}", e)
            })?;

            app.manage(db);

            println!("Database initialized!");

            Ok(())
        })
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
            update_nestling_timestamp,
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
            // Mindmap
            create_node,
            get_nodes,
            update_node,
            delete_node,
            create_edge,
            get_edges,
            delete_edge,
            // Background Music
            add_music,
            import_music,
            get_music,
            update_music,
            delete_music,
            // Bookmark
            create_bookmark,
            get_bookmarks,
            toggle_bookmark_favorite,
            delete_bookmark,
            // Tag
            create_tag,
            get_tags,
            update_tag,
            delete_tag,
            attach_tag,
            get_all_nestling_tags,
            detach_tag
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
