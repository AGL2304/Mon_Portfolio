import secrets
from datetime import UTC, datetime, timedelta

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt

from .config import get_settings

auth_scheme = HTTPBearer(auto_error=False)


def verify_admin_credentials(email: str | None, password: str) -> bool:
    """Verifie les identifiants admin.

    Email ET mot de passe sont obligatoires. La comparaison utilise
    `secrets.compare_digest` pour rester resistante aux timing attacks
    (les deux comparaisons sont toujours executees, meme si email est None).
    """
    settings = get_settings()
    # On compare toujours les deux pour ne pas leaker via le temps quel champ a echoue.
    password_match = secrets.compare_digest(password or "", settings.admin_password)
    email_match = secrets.compare_digest(email or "", settings.admin_email)
    return email_match and password_match


def create_access_token() -> str:
    settings = get_settings()
    expire = datetime.now(UTC) + timedelta(minutes=settings.token_expire_minutes)
    payload = {"sub": "admin", "exp": expire}
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def require_admin(credentials: HTTPAuthorizationCredentials | None = Depends(auth_scheme)) -> str:
    unauthorized = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Acces non autorise.",
    )

    if credentials is None:
        raise unauthorized

    settings = get_settings()
    token = credentials.credentials
    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
    except JWTError as exc:
        raise unauthorized from exc

    if payload.get("sub") != "admin":
        raise unauthorized

    return "admin"
