use crate::models::{AppConfig, ConnectionConfig, KeyValue};
use etcd_client::{Client, ConnectOptions};
use std::fs;
use std::path::PathBuf;
use tauri::{AppHandle, Manager, State};
// use tauri_plugin_fs::FsExt; // Not needed if using fs::read directly via std::fs with path from app_config_dir
use tokio::sync::Mutex;

pub struct AppState {
    pub client: Mutex<Option<Client>>,
}

#[tauri::command]
pub async fn test_etcd_connection(
    hosts: Vec<String>,
    username: Option<String>,
    password: Option<String>,
) -> Result<bool, String> {
    let mut options = ConnectOptions::new();
    if let (Some(u), Some(p)) = (username, password) {
        options = options.with_user(u, p);
    }

    Client::connect(&hosts, Some(options))
        .await
        .map(|_| true)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn connect_etcd(
    state: State<'_, AppState>,
    hosts: Vec<String>,
    username: Option<String>,
    password: Option<String>,
) -> Result<bool, String> {
    let mut options = ConnectOptions::new();
    if let (Some(u), Some(p)) = (username, password) {
        options = options.with_user(u, p);
    }

    let client = Client::connect(&hosts, Some(options))
        .await
        .map_err(|e| e.to_string())?;

    let mut state_client = state.client.lock().await;
    *state_client = Some(client);
    Ok(true)
}

// Configuration helper
fn get_config_path(app: &AppHandle) -> Result<PathBuf, String> {
    app.path()
        .app_config_dir()
        .map(|p| p.join("config.json"))
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn save_connection_config(
    app: AppHandle,
    config: ConnectionConfig,
) -> Result<(), String> {
    let config_path = get_config_path(&app)?;
    
    // Ensure directory exists
    if let Some(parent) = config_path.parent() {
        fs::create_dir_all(parent).map_err(|e| e.to_string())?;
    }

    let mut app_config = if config_path.exists() {
        let content = fs::read_to_string(&config_path).map_err(|e| e.to_string())?;
        serde_json::from_str::<AppConfig>(&content).unwrap_or(AppConfig {
            connections: vec![],
            settings: Default::default(),
        })
    } else {
        AppConfig {
            connections: vec![],
            settings: Default::default(),
        }
    };

    // Update or add connection
    if let Some(idx) = app_config.connections.iter().position(|c| c.name == config.name) {
        app_config.connections[idx] = config;
    } else {
        app_config.connections.push(config);
    }

    let content = serde_json::to_string_pretty(&app_config).map_err(|e| e.to_string())?;
    fs::write(config_path, content).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub async fn get_saved_connections(app: AppHandle) -> Result<Vec<ConnectionConfig>, String> {
    let config_path = get_config_path(&app)?;
    if !config_path.exists() {
        return Ok(vec![]);
    }

    let content = fs::read_to_string(config_path).map_err(|e| e.to_string())?;
    let app_config: AppConfig = serde_json::from_str(&content).map_err(|e| e.to_string())?;
    Ok(app_config.connections)
}

#[tauri::command]
pub async fn delete_connection(app: AppHandle, name: String) -> Result<(), String> {
    let config_path = get_config_path(&app)?;
    if !config_path.exists() {
        return Ok(());
    }

    let content = fs::read_to_string(&config_path).map_err(|e| e.to_string())?;
    let mut app_config: AppConfig = serde_json::from_str(&content).map_err(|e| e.to_string())?;

    app_config.connections.retain(|c| c.name != name);

    let content = serde_json::to_string_pretty(&app_config).map_err(|e| e.to_string())?;
    fs::write(config_path, content).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub async fn get_key_values(
    state: State<'_, AppState>,
    prefix: String,
    _limit: Option<i64>,
) -> Result<Vec<KeyValue>, String> {
    let mut client_guard = state.client.lock().await;
    let client = client_guard.as_mut().ok_or("Not connected to ETCD")?;

    let options = etcd_client::GetOptions::new().with_prefix();
    // let options = if let Some(l) = limit {
    //     options.with_limit(l)
    // } else {
    //     options
    // };
    // Note: limit in etcd-client options might be different, let's keep it simple for now

    let resp = client.get(prefix, Some(options)).await.map_err(|e| e.to_string())?;

    let kvs = resp
        .kvs()
        .iter()
        .map(|kv| KeyValue {
            key: kv.key_str().unwrap_or("").to_string(),
            value: kv.value_str().unwrap_or("").to_string(),
            version: kv.version(),
            create_revision: kv.create_revision(),
            mod_revision: kv.mod_revision(),
            lease: kv.lease(),
        })
        .collect();

    Ok(kvs)
}

#[tauri::command]
pub async fn set_key_value(
    state: State<'_, AppState>,
    key: String,
    value: String,
) -> Result<(), String> {
    let mut client_guard = state.client.lock().await;
    let client = client_guard.as_mut().ok_or("Not connected to ETCD")?;

    client.put(key, value, None).await.map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub async fn delete_key(state: State<'_, AppState>, key: String) -> Result<(), String> {
    let mut client_guard = state.client.lock().await;
    let client = client_guard.as_mut().ok_or("Not connected to ETCD")?;

    client.delete(key, None).await.map_err(|e| e.to_string())?;
    Ok(())
}
