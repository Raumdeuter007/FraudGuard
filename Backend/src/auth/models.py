from datetime import datetime, timezone

from fastapi_users.db import SQLAlchemyBaseUserTableUUID
from sqlalchemy import Column, DateTime, String
from sqlalchemy.orm import relationship

from src.models import Base


def utcnow():
    return datetime.now(timezone.utc)


class User(SQLAlchemyBaseUserTableUUID, Base):
    __tablename__ = "users"

    # inherited: id, email, hashed_password, is_active, is_superuser, is_verified

    name       = Column(String)
    created_at = Column(DateTime, nullable=False, default=utcnow)
    updated_at = Column(DateTime, nullable=False, default=utcnow, onupdate=utcnow)

    files = relationship("File", back_populates="user", cascade="all, delete-orphan")