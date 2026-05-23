from functools import lru_cache
from pathlib import Path
from typing import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, declarative_base, sessionmaker

from .config import get_settings

Base = declarative_base()


@lru_cache
def get_engine():
    settings = get_settings()
    url = settings.database_url

    # SQLite (utile pour tests + dev rapide) : besoin de connect_args + dossier auto.
    if url.startswith("sqlite"):
        if url.startswith("sqlite:///./"):
            relative_path = url.replace("sqlite:///./", "")
            Path(relative_path).parent.mkdir(parents=True, exist_ok=True)
        return create_engine(
            url,
            connect_args={"check_same_thread": False},
            future=True,
        )

    # PostgreSQL (defaut) : pool sain.
    return create_engine(
        url,
        future=True,
        pool_pre_ping=True,
        pool_size=5,
        max_overflow=10,
    )


@lru_cache
def get_session_factory():
    return sessionmaker(bind=get_engine(), autocommit=False, autoflush=False, future=True)


def get_db() -> Generator[Session, None, None]:
    session_factory = get_session_factory()
    db = session_factory()
    try:
        yield db
    finally:
        db.close()


def init_db() -> None:
    from . import models  # noqa: F401  ensure models are registered

    Base.metadata.create_all(bind=get_engine())
