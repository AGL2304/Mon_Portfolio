from sqlalchemy import JSON, Column, DateTime, Integer, LargeBinary, String, func

from .database import Base


class PortfolioDocument(Base):
    """Stocke tout le contenu du portfolio sous forme de document JSON unique.

    On utilise un document plutot que des tables relationnelles pour garder
    l'editeur admin simple et permettre des evolutions de schema sans migration.
    """

    __tablename__ = "portfolio_documents"

    id = Column(Integer, primary_key=True, index=True)
    data = Column(JSON, nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )


class CVDocument(Base):
    """CV uploade par l'admin (PDF), stocke en BYTEA."""

    __tablename__ = "cv_documents"

    id = Column(Integer, primary_key=True, index=True)
    data = Column(LargeBinary, nullable=False)
    filename = Column(String, nullable=False, default="CV.pdf")
    content_type = Column(String, nullable=False, default="application/pdf")
    updated_at = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )


class ProfileImage(Base):
    """Photo de profil uploadee par l'admin (JPG/PNG/WEBP), stockee en BYTEA."""

    __tablename__ = "profile_images"

    id = Column(Integer, primary_key=True, index=True)
    data = Column(LargeBinary, nullable=False)
    filename = Column(String, nullable=False, default="profile.jpg")
    content_type = Column(String, nullable=False, default="image/jpeg")
    updated_at = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )
