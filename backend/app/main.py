from fastapi import Depends, FastAPI, File, HTTPException, UploadFile, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from sqlalchemy.orm import Session

from .config import get_settings
from .crud import read_portfolio_content, update_portfolio_content
from .database import get_db, init_db
from .models import CVDocument
from .schemas import LoginRequest, PortfolioContent, TokenResponse
from .security import create_access_token, require_admin, verify_admin_credentials

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    debug=settings.debug,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins if settings.cors_origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup() -> None:
    init_db()


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
def put_admin_content(content: PortfolioContent, db: Session = Depends(get_db)) -> PortfolioContent:
    return update_portfolio_content(db, content)


@app.post("/api/admin/cv", dependencies=[Depends(require_admin)])
async def upload_cv(file: UploadFile = File(...), db: Session = Depends(get_db)) -> dict[str, str]:
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Seuls les fichiers PDF sont acceptes.")

    cv_bytes = await file.read()

    cv_doc = db.query(CVDocument).first()
    if cv_doc:
        cv_doc.data = cv_bytes
        cv_doc.filename = file.filename
    else:
        cv_doc = CVDocument(data=cv_bytes, filename=file.filename)
        db.add(cv_doc)
    db.commit()

    base_url = settings.app_base_url.rstrip("/")
    cv_url = f"{base_url}/api/public/cv"

    content = read_portfolio_content(db)
    content.profile.cv_url = cv_url
    update_portfolio_content(db, content)
    return {"cv_url": cv_url}


@app.get("/api/public/cv")
def download_cv(db: Session = Depends(get_db)) -> Response:
    cv_doc = db.query(CVDocument).first()
    if not cv_doc:
        raise HTTPException(status_code=404, detail="CV non disponible.")
    return Response(
        content=cv_doc.data,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{cv_doc.filename}"'},
    )

