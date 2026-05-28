from functools import lru_cache
from typing import Annotated

from pydantic import field_validator
from pydantic_settings import BaseSettings, NoDecode, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Portfolio API"
    app_version: str = "2.0.0"
    debug: bool = False

    # PostgreSQL par defaut. SQLite reste accepte pour les tests / dev rapide.
    database_url: str = "postgresql+psycopg2://portfolio:portfolio@localhost:5432/portfolio"

    jwt_secret: str = "change-this-secret-in-production"
    jwt_algorithm: str = "HS256"
    token_expire_minutes: int = 480
    admin_email: str = "admin@example.com"
    admin_password: str = "change-me-please"

    # Base URL publique de l'API (utilisee pour construire cv_url / photo_url
    # quand le frontend est sur un autre domaine). Si vide -> chemins relatifs.
    app_base_url: str = ""

    # Limites uploads (octets)
    max_cv_size: int = 10 * 1024 * 1024  # 10 MB
    max_photo_size: int = 5 * 1024 * 1024  # 5 MB
    # NoDecode = on court-circuite le JSON-decode automatique de pydantic-settings
    # pour ces listes. Le validateur parse_list ci-dessous gere les 3 formats :
    #   - vide  -> []
    #   - JSON  -> ["a","b"]
    #   - CSV   -> a,b,c   (PRATIQUE en prod : evite les " a escaper sur Render)
    allowed_photo_mimetypes: Annotated[list[str], NoDecode] = [
        "image/jpeg",
        "image/png",
        "image/webp",
    ]

    cors_origins: Annotated[list[str], NoDecode] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:4173",
        "https://mon-portfolio-mocha-ten.vercel.app",
    ]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    @field_validator("cors_origins", "allowed_photo_mimetypes", mode="before")
    @classmethod
    def parse_list(cls, value: str | list[str]) -> list[str]:
        if isinstance(value, str):
            stripped = value.strip()
            if not stripped:
                return []
            if stripped.startswith("["):
                return [
                    item.strip().strip("\"'")
                    for item in stripped.strip("[]").split(",")
                    if item.strip()
                ]
            return [item.strip() for item in stripped.split(",") if item.strip()]
        return value


@lru_cache
def get_settings() -> Settings:
    return Settings()
