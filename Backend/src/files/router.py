import os
import shutil
import tempfile as tf

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from src.auth.dependencies import current_active_user
from src.auth.models import User
from src.database import get_async_session
from src.imagekit.client import imageKit

router = APIRouter(prefix="/files", tags=["files"])


@router.post("/upload")
async def upload(
    file: UploadFile = File(...),
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user),
):
    temp_path = None
    file.filename = file.filename or ""
    try:
        with tf.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as tmp:
            temp_path = tmp.name
            shutil.copyfileobj(file.file, tmp)

        with open(temp_path, "rb") as f:
            upload_result = imageKit.files.upload(
                file=f,
                file_name=file.filename,
                use_unique_file_name=True,
                tags=["backend-upload"],
            )

        return {"url": upload_result.url}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if temp_path and os.path.exists(temp_path):
            os.unlink(temp_path)
        file.file.close()