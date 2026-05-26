from sqlalchemy.orm import Session

from .models import CVDocument, PortfolioDocument, ProfileImage
from .schemas import PortfolioContent
from .seed_data import default_portfolio_content

PORTFOLIO_DOC_ID = 1


def get_or_create_portfolio_document(db: Session) -> PortfolioDocument:
    document = db.get(PortfolioDocument, PORTFOLIO_DOC_ID)
    if document is None:
        document = PortfolioDocument(id=PORTFOLIO_DOC_ID, data=default_portfolio_content())
        db.add(document)
        db.commit()
        db.refresh(document)
    return document


def read_portfolio_content(db: Session) -> PortfolioContent:
    document = get_or_create_portfolio_document(db)
    return PortfolioContent.model_validate(document.data)


def update_portfolio_content(db: Session, content: PortfolioContent) -> PortfolioContent:
    document = get_or_create_portfolio_document(db)
    document.data = content.model_dump(mode="json")
    db.add(document)
    db.commit()
    db.refresh(document)
    return PortfolioContent.model_validate(document.data)


# --- CV ------------------------------------------------------------------


def upsert_cv(db: Session, data: bytes, filename: str, content_type: str) -> CVDocument:
    cv = db.query(CVDocument).first()
    if cv is None:
        cv = CVDocument(data=data, filename=filename, content_type=content_type)
        db.add(cv)
    else:
        cv.data = data
        cv.filename = filename
        cv.content_type = content_type
    db.commit()
    db.refresh(cv)
    return cv


def get_cv(db: Session) -> CVDocument | None:
    return db.query(CVDocument).first()


# --- Photo ---------------------------------------------------------------


def upsert_profile_image(
    db: Session, data: bytes, filename: str, content_type: str
) -> ProfileImage:
    img = db.query(ProfileImage).first()
    if img is None:
        img = ProfileImage(data=data, filename=filename, content_type=content_type)
        db.add(img)
    else:
        img.data = data
        img.filename = filename
        img.content_type = content_type
    db.commit()
    db.refresh(img)
    return img


def get_profile_image(db: Session) -> ProfileImage | None:
    return db.query(ProfileImage).first()
