from fastapi import Depends, FastAPI, File, HTTPException, UploadFile, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from sqlalchemy.orm import Session

from .config import get_settings
from .crud import (
    get_cv,
    get_profile_image,
    read_portfolio_content,
    update_portfolio_content,
    upsert_cv,
    upsert_profile_image,
)
from .database import get_db, init_db
from .schemas import (
    LoginRequest,
    PortfolioContent,
    TokenResponse,
    UploadResponse,
)
from .security import create_access_token, require_admin, verify_admin_credentials

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    debug=settings.debug,
)

# CORS : on n'accepte JAMAIS allow_origins=["*"] avec allow_credentials=True
# (combinaison interdite par la spec CORS / refusee par les navigateurs).
# Si aucune origine n'est configuree, on refuse tout cross-origin par defaut.
if not settings.cors_origins:
    raise RuntimeError(
        "CORS_ORIGINS doit etre defini explicitement (liste d'origines autorisees)."
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)


@app.on_event("startup")
def startup() -> None:
    init_db()


# ============================================================
#  HEALTHCHECK & AUTH
# ============================================================

@app.get("/api/health")
def healthcheck() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/auth/login", response_model=TokenResponse)
def login(payload: LoginRequest) -> TokenResponse:
    if not verify_admin_credentials(payload.email, payload.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou mot de passe invalide.",
        )
    token = create_access_token()
    return TokenResponse(access_token=token)


# ============================================================
#  CONTENT (public + admin)
# ============================================================

@app.get("/api/public/content", response_model=PortfolioContent)
def get_public_content(db: Session = Depends(get_db)) -> PortfolioContent:
    return read_portfolio_content(db)


@app.get(
    "/api/admin/content",
    response_model=PortfolioContent,
    dependencies=[Depends(require_admin)],
)
def get_admin_content(db: Session = Depends(get_db)) -> PortfolioContent:
    return read_portfolio_content(db)


@app.put(
    "/api/admin/content",
    response_model=PortfolioContent,
    dependencies=[Depends(require_admin)],
)
def put_admin_content(
    content: PortfolioContent, db: Session = Depends(get_db)
) -> PortfolioContent:
    return update_portfolio_content(db, content)


# ============================================================
#  CV (upload admin + download public)
# ============================================================

@app.post(
    "/api/admin/cv",
    response_model=UploadResponse,
    dependencies=[Depends(require_admin)],
)
async def upload_cv(
    file: UploadFile = File(...), db: Session = Depends(get_db)
) -> UploadResponse:
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Seuls les fichiers PDF sont acceptes.",
        )

    data = await file.read()
    if len(data) > settings.max_cv_size:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"CV trop volumineux (max {settings.max_cv_size // (1024 * 1024)} MB).",
        )

    upsert_cv(
        db,
        data=data,
        filename=file.filename,
        content_type=file.content_type or "application/pdf",
    )

    base_url = settings.app_base_url.rstrip("/")
    cv_url = f"{base_url}/api/public/cv" if base_url else "/api/public/cv"

    content = read_portfolio_content(db)
    content.profile.cv_url = cv_url
    update_portfolio_content(db, content)

    return UploadResponse(
        url=cv_url, filename=file.filename, content_type="application/pdf"
    )


@app.delete(
    "/api/admin/cv",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_admin)],
)
def delete_cv(db: Session = Depends(get_db)) -> Response:
    cv = get_cv(db)
    if cv is not None:
        db.delete(cv)
        db.commit()
    content = read_portfolio_content(db)
    content.profile.cv_url = ""
    update_portfolio_content(db, content)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@app.get("/api/public/cv")
def download_cv(db: Session = Depends(get_db)) -> Response:
    cv = get_cv(db)
    if cv is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="CV non disponible."
        )
    return Response(
        content=cv.data,
        media_type=cv.content_type or "application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{cv.filename}"',
            "Cache-Control": "no-cache",
        },
    )


# ============================================================
#  PHOTO de profil (upload admin + GET public)
# ============================================================

@app.post(
    "/api/admin/photo",
    response_model=UploadResponse,
    dependencies=[Depends(require_admin)],
)
async def upload_photo(
    file: UploadFile = File(...), db: Session = Depends(get_db)
) -> UploadResponse:
    content_type = (file.content_type or "").lower()
    if content_type not in settings.allowed_photo_mimetypes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Format non supporte. Formats autorises : "
                + ", ".join(settings.allowed_photo_mimetypes)
            ),
        )

    data = await file.read()
    if len(data) > settings.max_photo_size:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Photo trop volumineuse (max {settings.max_photo_size // (1024 * 1024)} MB).",
        )

    upsert_profile_image(
        db,
        data=data,
        filename=file.filename or "profile",
        content_type=content_type,
    )

    base_url = settings.app_base_url.rstrip("/")
    photo_url = (
        f"{base_url}/api/public/photo" if base_url else "/api/public/photo"
    )

    content = read_portfolio_content(db)
    content.profile.profile_image = photo_url
    update_portfolio_content(db, content)

    return UploadResponse(
        url=photo_url,
        filename=file.filename or "profile",
        content_type=content_type,
    )


@app.delete(
    "/api/admin/photo",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_admin)],
)
def delete_photo(db: Session = Depends(get_db)) -> Response:
    img = get_profile_image(db)
    if img is not None:
        db.delete(img)
        db.commit()
    content = read_portfolio_content(db)
    content.profile.profile_image = ""
    update_portfolio_content(db, content)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@app.get("/api/public/photo")
def get_photo(db: Session = Depends(get_db)) -> Response:
    img = get_profile_image(db)
    if img is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Photo non disponible."
        )
    return Response(
        content=img.data,
        media_type=img.content_type or "image/jpeg",
        headers={"Cache-Control": "public, max-age=3600"},
    )
