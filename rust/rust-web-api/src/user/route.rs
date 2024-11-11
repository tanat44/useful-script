use axum::Json;

use super::user::User;

pub async fn get_user() -> Json<User> {
    let user: User = User {
        id: 213,
        firstname: String::from("James"),
        lastname: String::from("James"),
    };
    Json(user)
}
