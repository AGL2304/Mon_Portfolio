import os
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

# Pour les tests on utilise SQLite (rapide, pas de service externe).
# Le defaut prod reste PostgreSQL via config.py / docker-compose.
TEST_DB = Path(__file__).parent / "test_portfolio.db"

os.environ["DATABASE_URL"] = f"sqlite:///{TEST_DB.as_posix()}"
os.environ["ADMIN_EMAIL"] = "admin@test.local"
os.environ["ADMIN_PASSWORD"] = "test-admin-password"
os.environ["JWT_SECRET"] = "test-secret"

from app.config import get_settings  # noqa: E402
from app.database import Base, get_engine, get_session_factory  # noqa: E402
from app.main import app  # noqa: E402


@pytest.fixture(autouse=True)
def reset_database():
    get_settings.cache_clear()
    get_engine.cache_clear()
    get_session_factory.cache_clear()
    engine = get_engine()
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield


@pytest.fixture()
def client():
    with TestClient(app) as test_client:
        yield test_client
