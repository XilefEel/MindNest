mod auth;
use auth::init_db;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    init_db().expect("Failed to initialize DB");
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![auth::signup_user, auth::login_user])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
