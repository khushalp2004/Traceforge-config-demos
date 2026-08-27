use axum::{routing::get, Router};
use std::net::SocketAddr;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

mod handlers;

#[tokio::main]
async fn main() {
    usetraceforge::init();

    // Initialize tracing
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "rust_testing_app=debug,tower_http=debug".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    // Build our application with a route
    let app = Router::new()
        .route("/", get(|| async { "Hello, Rust Learning Laboratory!" }))
        .route("/errors/panic", get(|| async { 
            panic!("This is a TraceForge test crash!"); 
            #[allow(unreachable_code)] 
            () 
        }))
        .route("/errors/panic-oob", get(handlers::errors::panic_oob))
        .route("/errors/unwrap", get(handlers::errors::unwrap_missing))
        .route("/errors/result", get(handlers::errors::result_db_error))
        .route("/errors/file", get(handlers::errors::file_io_error))
        .route("/errors/timeout", get(handlers::errors::slow_timeout));

    // Run it
    let port = 5173;
    let addr = SocketAddr::from(([0, 0, 0, 0], port));
    tracing::info!("listening on {}", addr);
    
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
