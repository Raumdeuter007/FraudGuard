import os
import shutil
import tempfile as tf

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, Request
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
    request: Request,
    name: str,
    file: UploadFile = File(...),
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user),
):
        temp_path = None
        file.filename = file.filename or ""
        original_ext = os.path.splitext(file.filename)[1]
        file_name = f"{str(user.id)}{name}{original_ext}"

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
            
           # --- Read bytes once for reuse ---
            with open(temp_path, "rb") as f:
                file_bytes = f.read()
    
            # --- Upload original to ImageKit ---
            upload_result = imageKit.files.upload(
                file=file_bytes,
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
            # --- Run tampering detection ---
            detector = request.app.state.detector
            # if mime_type == "application/pdf":
            #     # Convert each PDF page to image, run inference on first page only
            #     # Extend to multi-page by iterating if needed
            #     import fitz  # pymupdf
            #     pdf_doc = fitz.open(stream=file_bytes, filetype="pdf")
            #     pix = pdf_doc[0].get_pixmap(dpi=150)
            #     import numpy as np
            #     page_rgb = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.h, pix.w, pix.n)
            #     import cv2
            #     if pix.n == 4:  # RGBA
            #         page_rgb = cv2.cvtColor(page_rgb, cv2.COLOR_RGBA2RGB)
            #     import io
            #     _, inference_bytes = cv2.imencode(".png", cv2.cvtColor(page_rgb, cv2.COLOR_RGB2BGR))
            #     inference_bytes = inference_bytes.tobytes()
            # else:
            inference_bytes = file_bytes
            mask_bytes, overlay_bytes = detector.predict_and_encode(inference_bytes)

            # --- Upload overlay (heatmap) to ImageKit ---
            overlay_name = f"{str(user.id)}{name}_overlay.png"
            overlay_upload = imageKit.files.upload(
                file=overlay_bytes,
                file_name=overlay_name,
                folder="/Results",
                use_unique_file_name=True,
                tags=["detection-overlay"],
            )

            return db_file
        except HTTPException:
            raise   
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