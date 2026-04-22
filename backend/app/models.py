from sqlalchemy import JSON, Column, DateTime, Integer, func

from .database import Base


class PortfolioDocument(Base):
    __tablename__ = "portfolio_documents"

    id = Column(Integer, primary_key=True, index=True)
    data = Column(JSON, nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

