use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize)]
pub struct SignupData {
    pub username: String,
    pub email: String,
    pub password: String,
}

#[derive(Debug, Deserialize)]
pub struct LoginData {
    pub email: String,
    pub password: String,
}

#[derive(Debug, Serialize)]
pub struct User {
    pub id: i32,
    pub username: String,
    pub email: String,
}