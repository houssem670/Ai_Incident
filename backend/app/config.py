from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


BASE_DIR = Path(__file__).resolve().parent.parent


class Settings(BaseSettings):
    # ==========================================================
    # Application
    # ==========================================================

    APP_NAME: str
    API_VERSION: str

    # ==========================================================
    # Server
    # ==========================================================

    HOST: str
    PORT: int

    # ==========================================================
    # PostgreSQL
    # ==========================================================

    POSTGRES_HOST: str
    POSTGRES_PORT: int
    POSTGRES_DB: str
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str

    # ==========================================================
    # Authentication / JWT
    # ==========================================================

    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int

    # ==========================================================
    # Authentication users
    # ==========================================================

    AUTH_ADMIN_USERNAME: str
    AUTH_ADMIN_PASSWORD: str

    AUTH_ANALYST_USERNAME: str
    AUTH_ANALYST_PASSWORD: str

    AUTH_MANAGER_USERNAME: str
    AUTH_MANAGER_PASSWORD: str

    # ==========================================================
    # CORS
    # ==========================================================

    CORS_ALLOWED_ORIGINS: str

    # ==========================================================
    # Internal API authentication
    # ==========================================================

    INTERNAL_API_KEY: str

    # ==========================================================
    # Pydantic Settings
    # ==========================================================

    model_config = SettingsConfigDict(
        env_file=BASE_DIR / ".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()