from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase, Session

from app.core.config import settings

# SQLite engine; swap database_url in .env for Postgres in prod
engine = create_engine(
    settings.database_url or "sqlite:///./aether.db",
    connect_args={"check_same_thread": False},  # needed only for SQLite
)

SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)


class Base(DeclarativeBase):
    pass


def get_db():
    # FastAPI dependency — yields a DB session and closes it after the request
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()
