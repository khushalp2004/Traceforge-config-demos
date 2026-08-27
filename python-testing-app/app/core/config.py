from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Python Testing App"
    ENVIRONMENT: str = "development"
    SECRET_KEY: str = "supersecretkey-for-development-only-change-in-prod"
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/testdb"
    REDIS_URL: str = "redis://localhost:6379/0"
    CPU_LIMIT_ITERATIONS: int = 10000000
    TRACEFORGE_API_KEY: str | None = None
    TRACEFORGE_INGEST_URL: str | None = None
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

settings = Settings()
