use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ConnectionConfig {
    pub name: String,
    pub hosts: Vec<String>,
    pub username: Option<String>,
    pub password: Option<String>,
    #[serde(rename = "createdAt")]
    pub created_at: i64,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct AppConfig {
    pub connections: Vec<ConnectionConfig>,
    pub settings: Settings,
}

#[derive(Debug, Serialize, Deserialize, Clone, Default)]
pub struct Settings {
    pub theme: String,
    #[serde(rename = "fontSize")]
    pub font_size: u32,
    #[serde(rename = "autoConnect")]
    pub auto_connect: bool,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct KeyValue {
    pub key: String,
    pub value: String,
    pub version: i64,
    #[serde(rename = "createRevision")]
    pub create_revision: i64,
    #[serde(rename = "modRevision")]
    pub mod_revision: i64,
    pub lease: i64,
}
