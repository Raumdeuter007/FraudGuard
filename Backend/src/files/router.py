import os
import shutil
import tempfile as tf

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.files.models import File as FileModel 
from src.auth.dependencies import current_active_user
from src.files.config import ALLOWED_MIME_TYPES
from src.auth.models import User
from src.database import get_async_session
from src.imagekit.client import imageKit
import magic  

router = APIRouter(prefix="/files", tags=["files"])


@router.post("/upload")
async def upload(
    name: str,
    file: UploadFile = File(...),
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user),
):
        temp_path = None
        file.filename = file.filename or ""
        original_ext = os.path.splitext(file.filename)[1]
        file_name = f"{name}{original_ext}"

        try:
            with tf.NamedTemporaryFile(delete=False, suffix=original_ext) as tmp:
                temp_path = tmp.name
                shutil.copyfileobj(file.file, tmp)
            
            mime_type = magic.from_file(temp_path, mime=True)

            if mime_type not in ALLOWED_MIME_TYPES:
                raise HTTPException(
                    status_code=415,
                    detail=f"Unsupported file type: {mime_type}. Allowed: images and PDFs only.",
                )
            
            with open(temp_path, "rb") as f:
                upload_result = imageKit.files.upload(
                    file=f,
                    file_name=file_name,
                    folder="/Uploads",
                    use_unique_file_name=True,
                    tags=["backend-upload"],
                )
            
                db_file = FileModel(
                    user_id=str(user.id),
                    imagekit_file_id=upload_result.file_id,
                    imagekit_url=upload_result.url,
                    file_path=upload_result.file_path,
                    original_name=file_name,
                    mime_type=mime_type,
                    size_bytes=upload_result.size,
                    upload_status="done",
                )
                session.add(db_file)
                await session.commit()
                await session.refresh(db_file)

            return db_file

        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
        finally:
            if temp_path and os.path.exists(temp_path):
                os.unlink(temp_path)
            file.file.close()

@router.get("/")
async def get_files(
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user),
):
    result = await session.execute(select(FileModel).where(FileModel.user_id == str(user.id)))
    files = [row[0] for row in result.all()]

    file_data = []
    for f in files:
        file_data.append({
            "id": str(f.id),
            "url": f.imagekit_url,
            "mime_type": f.mime_type,
            "name": f.original_name,
            "created_at": f.created_at.isoformat(),
        })
    return {"files": file_data}

@router.get("/{id}")
async def get_file_by_id(
    id: str,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user),
):
    result = await session.execute(select(FileModel).where(FileModel.user_id == str(user.id) and FileModel.id == id))
    file = result.scalars().first()
    return file