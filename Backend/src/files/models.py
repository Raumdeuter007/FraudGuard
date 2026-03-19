# src/files/models.py
import uuid
from datetime import datetime, timezone

from sqlalchemy import (
    CheckConstraint, Column, DateTime,
    Float, ForeignKey, Index, Integer, String, Text
)
from sqlalchemy.orm import relationship
from sqlalchemy import text

from src.models import Base


def utcnow():
    return datetime.now(timezone.utc)

def gen_uuid():
    return uuid.uuid4().hex


class File(Base):
    __tablename__ = "files"

    id               = Column(String, primary_key=True, default=gen_uuid)
    user_id          = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    imagekit_file_id = Column(String, nullable=False, unique=True)
    imagekit_url     = Column(String, nullable=False)
    file_path        = Column(String, nullable=False)

    original_name    = Column(String, nullable=False)
    mime_type        = Column(String)
    size_bytes       = Column(Integer)
    upload_status    = Column(String, nullable=False, default="pending", server_default="pending")

    created_at = Column(DateTime, nullable=False, default=utcnow,
        server_default=text("(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))"))
    updated_at = Column(DateTime, nullable=False, default=utcnow, onupdate=utcnow,
        server_default=text("(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))"))

    user  = relationship("User", back_populates="files")
    scans = relationship("Scan", back_populates="file", cascade="all, delete-orphan")

    __table_args__ = (
        CheckConstraint("upload_status IN ('pending', 'done', 'failed')", name="ck_files_upload_status"),
        Index("idx_files_user_id", "user_id"),
    )


class Scan(Base):
    __tablename__ = "scans"

    id      = Column(String, primary_key=True, default=gen_uuid)
    file_id = Column(String, ForeignKey("files.id", ondelete="CASCADE"), nullable=False)

    scan_type = Column(String, nullable=False)
    status    = Column(String, nullable=False, default="pending")

    heatmap_imagekit_file_id = Column(String, unique=True)
    heatmap_imagekit_url     = Column(String)
    heatmap_file_path        = Column(String)

    tamper_confidence = Column(Float)
    is_tampered       = Column(Integer)

    forgery_confidence = Column(Float)
    is_forged          = Column(Integer)

    raw_result    = Column(Text)
    error_message = Column(Text)
    started_at    = Column(DateTime)
    completed_at  = Column(DateTime)
    created_at    = Column(DateTime, nullable=False, default=utcnow)
    updated_at    = Column(DateTime, nullable=False, default=utcnow, onupdate=utcnow)

    file = relationship("File", back_populates="scans")

    __table_args__ = (
        CheckConstraint("scan_type IN ('tamper', 'forgery', 'both')", name="ck_scans_scan_type"),
        CheckConstraint(
            "status IN ('pending', 'preprocessing', 'inferring', 'generating_heatmap', 'done', 'failed')",
            name="ck_scans_status"
        ),
        Index("idx_scans_file_id", "file_id"),
    )