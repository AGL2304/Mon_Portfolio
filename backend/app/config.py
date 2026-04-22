from functools import lru_cache

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Portfolio API"
    app_version: str = "1.0.0"
    debug: bool = False

    database_url: str = "sqlite:///./data/portfolio.db"
    jwt_secret: str = "change-this-secret-in-production"
    jwt_algorithm: str = "HS256"
    token_expire_minutes: int = 480
    admin_email: str = "admin@example.com"
    admin_password: str = "change-me-please"

    cors_origins: list[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
    ]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, value: str | list[str]) -> list[str]:
        if isinstance(value, str):
            stripped = value.strip()
            if not stripped:
                return []
            if stripped.startswith("["):
                return [item.strip().strip("\"'") for item in stripped.strip("[]").split(",") if item.strip()]
            return [item.strip() for item in stripped.split(",") if item.strip()]
        return value


@lru_cache
def get_settings() -> Settings:
    return Settings()

