import asyncio
from datetime import datetime, timezone
import json
import os
import shutil
import tempfile as tf

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, Request
from fastapi.sse import EventSourceResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.files.models import File as FileModel, Scan 
from src.auth.dependencies import current_active_user
from src.files.config import ALLOWED_MIME_TYPES, THRESHOLD
from src.auth.models import User
from src.database import get_async_session
from src.imagekit.client import imageKit
import magic  

router = APIRouter(prefix="/files", tags=["files"])


@router.post("/upload", response_class=EventSourceResponse)
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
    file_name = f"{str(user.id)}_{name}_{original_ext}"

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
            file_bytes = f.read()

        # 1. Upload original
        upload_result = await asyncio.get_running_loop().run_in_executor(
            None, lambda: imageKit.files.upload(
                file=file_bytes,
                file_name=file_name,
                folder="/Uploads",
                use_unique_file_name=True,
                tags=["backend-upload"],
            )
        )
        db_file = FileModel(
            user_id=str(user.id),
            imagekit_file_id=upload_result.file_id,
            imagekit_url=upload_result.url,
            file_path=upload_result.file_path,
            original_name=name,
            mime_type=mime_type,
            size_bytes=upload_result.size,
            upload_status="done",
        )
        session.add(db_file)
        await session.commit()
        await session.refresh(db_file)            
        yield json.dumps({"event": "upload_complete", "file_id": str(db_file.id)})

        # 2. Inference
        detector = request.app.state.detector
        # For pdf (needs further review)
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
        start_time = datetime.now(timezone.utc)
        _, overlay_bytes, score, mean_score = await asyncio.get_running_loop().run_in_executor(
            None, detector.predict_and_encode, file_bytes
        )
        is_tampered = score > THRESHOLD
        yield json.dumps({"event": "inference_complete", "score": score, "is_tampered": is_tampered, "mean_score": mean_score})

        # 3. Upload overlay
        overlay_name = f"{str(user.id)}_{name}_overlay.png"
        overlay_result = await asyncio.get_running_loop().run_in_executor(
            None, lambda: imageKit.files.upload(
                file=overlay_bytes,
                file_name=overlay_name,
                folder="/Results",
                use_unique_file_name=True,
                tags=["detection-overlay"],
            )
        )
        yield json.dumps({"event": "overlay_complete", "overlay_url": overlay_result.url})

        # 4. Final DB write + result
        scan_file = Scan(
            file_id=str(db_file.id),
            scan_type="tamper",
            heatmap_imagekit_file_id=overlay_result.file_id,
            heatmap_imagekit_url=overlay_result.url,
            heatmap_file_path=overlay_result.file_path,
            tamper_percent=score,
            is_tampered=is_tampered,
            status="done",
            started_at=start_time,
            completed_at=datetime.now(timezone.utc),
        )
        session.add(scan_file)
        await session.commit()
        await session.refresh(scan_file)
        yield json.dumps({
                "event": "done",
                'file_id': str(db_file.id), 
                'scan_id': str(scan_file.id), 
                'is_tampered': is_tampered,
                'score': score, 
                'mean_score': mean_score, 
                'overlay_url': overlay_result.url,
                'file_url': upload_result.url,
            })

    except Exception as e:
            yield json.dumps({"event": "error", "detail": str(e)})
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
    file_result = await session.execute(
        select(FileModel)
        .where(FileModel.user_id == str(user.id))
        .where(FileModel.id == id)
    )
    file = file_result.scalars().first()
    if not file:
        raise HTTPException(status_code=404, detail="File not found")

    scan_result = await session.execute(
        select(Scan).where(Scan.file_id == id)
    )
    scan = scan_result.scalars().first()

    return {
        "id": str(file.id),
        "url": file.imagekit_url,
        "mime_type": file.mime_type,
        "name": file.original_name,
        "size_bytes": file.size_bytes,
        "upload_status": file.upload_status,
        "created_at": file.created_at.isoformat(),
        "scan": {
            "id": str(scan.id),
            "scan_type": scan.scan_type,
            "status": scan.status,
            "heatmap_url": scan.heatmap_imagekit_url,
            "tamper_percent": scan.tamper_percent,
            "is_tampered": bool(scan.is_tampered) if scan.is_tampered is not None else None,
            "forgery_confidence": scan.forgery_confidence,
            "is_forged": bool(scan.is_forged) if scan.is_forged is not None else None,
            "started_at": scan.started_at,
            "completed_at": scan.completed_at,
        } if scan else None,
    }

@router.delete("/{id}", status_code=204)
async def delete_file(
    id: str,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user),
):
    file_result = await session.execute(
        select(FileModel)
        .where(FileModel.user_id == str(user.id))
        .where(FileModel.id == id)
    )
    file = file_result.scalars().first()
    if not file:
        raise HTTPException(status_code=404, detail="File not found")

    # Delete from ImageKit
    scan_result = await session.execute(select(Scan).where(Scan.file_id == id))
    scan = scan_result.scalars().first()

    imagekit_deletes = [file.imagekit_file_id]
    if scan and scan.heatmap_imagekit_file_id is not None:
        imagekit_deletes.append(scan.heatmap_imagekit_file_id)

    for ik_id in imagekit_deletes:
        await asyncio.get_running_loop().run_in_executor(
            None, lambda i=ik_id: imageKit.files.delete(str(i)) 
        )

    await session.delete(file)
    await session.commit()