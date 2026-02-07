mod commands;
mod models;

use commands::*;
use tokio::sync::Mutex;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .manage(AppState {
            client: Mutex::new(None),
        })
        .invoke_handler(tauri::generate_handler![
            test_etcd_connection,
            connect_etcd,
            save_connection_config,
            get_saved_connections,
            delete_connection,
            get_key_values,
            set_key_value,
            delete_key
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
