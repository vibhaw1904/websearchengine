from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import chat, health, auth
from app.core.config import settings
from app.core.database import engine, Base

# Import models so SQLAlchemy registers them before create_all
import app.models.user  # noqa: F401

app = FastAPI(title=settings.app_name)

# Create all DB tables on startup (SQLite; replace with Alembic migrations for prod)
Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(auth.router)
app.include_router(chat.router)
