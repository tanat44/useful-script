use serde::Serialize;

#[derive(Serialize)]
pub struct User {
    pub id: u32,
    pub firstname: String,
    pub lastname: String,
}
