from datetime import datetime, timedelta, timezone
import secrets

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt

from .config import get_settings

auth_scheme = HTTPBearer(auto_error=False)


def verify_admin_credentials(email: str | None, password: str) -> bool:
    """Verifie les identifiants admin.

    L'email est optionnel : s'il est fourni, il doit matcher; sinon on accepte
    juste le mot de passe (utile pour un setup minimal).
    """
    settings = get_settings()
    password_match = secrets.compare_digest(password, settings.admin_password)
    if email is None:
        return password_match
    email_match = secrets.compare_digest(email, settings.admin_email)
    return email_match and password_match


def create_access_token() -> str:
    settings = get_settings()
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.token_expire_minutes)
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
