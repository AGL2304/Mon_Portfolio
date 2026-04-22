from sqlalchemy.orm import Session

from .models import PortfolioDocument
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

