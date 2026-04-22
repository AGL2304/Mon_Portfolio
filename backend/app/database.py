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
    if settings.database_url.startswith("sqlite:///./"):
        relative_path = settings.database_url.replace("sqlite:///./", "")
        Path(relative_path).parent.mkdir(parents=True, exist_ok=True)

    connect_args = {"check_same_thread": False} if settings.database_url.startswith("sqlite") else {}
    return create_engine(settings.database_url, connect_args=connect_args, future=True)


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
    from . import models  # noqa: F401

    Base.metadata.create_all(bind=get_engine())

