use axum::{
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use serde_json::json;
use std::fs;

// 1. Realistic Panic: Array out of bounds (simulating bad pagination or indexing)
pub async fn panic_oob() {
    let users = vec!["alice", "bob"];
    // Accessing index 5 will panic realistically with index out of bounds
    let _user = users[5];
    #[allow(unreachable_code)]
    ()
}

// 2. Realistic Unwrap: Missing HTTP Header or missing DB record
pub async fn unwrap_missing() {
    let db_record: Option<String> = None;
    // Unwrapping None simulating a missing record that we assume exists
    let _val = db_record.unwrap();
    #[allow(unreachable_code)]
    ()
}

// 3. Result Error: Database connection failure simulation
pub async fn result_db_error() -> impl IntoResponse {
    // Manually capture the error since it doesn't crash the thread!
    usetraceforge::capture_message("Database connection pool exhausted (Simulated DB Down)");

    // Return a 500 Internal Server Error simulating DB down
    (
        StatusCode::INTERNAL_SERVER_ERROR,
        Json(json!({
            "error": "Database connection pool exhausted",
            "code": "DB_POOL_EMPTY"
        }))
    )
}

// 4. File I/O Error: Attempt to read missing config file
pub async fn file_io_error() -> impl IntoResponse {
    usetraceforge::capture_message("Failed to read config file");
    match fs::read_to_string("config/production.json") {
        Ok(content) => (StatusCode::OK, Json(json!({"content": content}))),
        Err(e) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({
                "error": format!("Failed to read config file: {}", e),
                "code": "FILE_NOT_FOUND"
            }))
        )
    }
}

// 5. Timeout Error: Simulated Slow API Call
pub async fn slow_timeout() -> impl IntoResponse {
    tokio::time::sleep(std::time::Duration::from_secs(10)).await;
    (
        StatusCode::GATEWAY_TIMEOUT,
        Json(json!({"error": "Upstream service timeout", "code": "TIMEOUT"}))
    )
}
