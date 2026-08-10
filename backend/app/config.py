from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


BASE_DIR = Path(__file__).resolve().parent.parent


class Settings(BaseSettings):
    APP_NAME: str
    API_VERSION: str

    HOST: str
    PORT: int

    POSTGRES_HOST: str
    POSTGRES_PORT: int
    POSTGRES_DB: str
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str

    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int

    AUTH_ADMIN_USERNAME: str = "socadmin"
    AUTH_ADMIN_PASSWORD: str = "Admin@123!"
    AUTH_ANALYST_USERNAME: str = "socanalyst"
    AUTH_ANALYST_PASSWORD: str = "Analyst@123!"
    AUTH_MANAGER_USERNAME: str = "socmanager"
    AUTH_MANAGER_PASSWORD: str = "Manager@123!"

    CORS_ALLOWED_ORIGINS: str = "http://localhost:5173"

    INTERNAL_API_KEY: str

    model_config = SettingsConfigDict(
        env_file=BASE_DIR / ".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()