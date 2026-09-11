from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "CyberQuant AI"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"

    # CORS Configuration
    BACKEND_CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
    ]

    # Mock Data File Location (defaults to mock_data.json at project root)
    MOCK_DATA_PATH: str = str(Path(__file__).resolve().parents[3] / "mock_data.json")

    # Database Configuration
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/cyberquant_db"

    # Redis & Celery Configuration
    REDIS_URL: str = "redis://localhost:6379/0"
    CELERY_BROKER_URL: str = "redis://localhost:6379/0"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/0"

    # Neo4j Integration Settings (Member 2 Placeholder)
    NEO4J_URI: str = "bolt://localhost:7687"
    NEO4J_USERNAME: str = "neo4j"
    NEO4J_PASSWORD: str = "cyberquant_secure_pass"
    # Security / Auth Settings
    JWT_SECRET_KEY: str = "cyberquant_super_secret_jwt_key_change_in_production_2026"
    ALGORITHM: str = "HS256"

    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore"
    )


settings = Settings()
