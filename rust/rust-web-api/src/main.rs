use axum::{routing::get, Router};
mod test;
mod user;

#[tokio::main]
async fn main() {
    let app = init_router();
    let port = 3000;
    println!("Starting server at  {port}");

    let listener = tokio::net::TcpListener::bind(format!("0.0.0.0:{port}"))
        .await
        .unwrap();
    axum::serve(listener, app).await.unwrap();
}

fn init_router() -> Router {
    Router::new()
        .route("/test", get(test::route::test))
        .route("/user", get(user::route::get_user))
}
