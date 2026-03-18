from fastapi import FastAPI, HTTPException, File, UploadFile, Form, Depends 
from src.database import create_db_and_tables, get_async_session
from sqlalchemy.ext.asyncio import AsyncSession
from contextlib import asynccontextmanager
from src.images import imageKit
import shutil
import os
import uuid
import tempfile as tf

@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_db_and_tables()
    yield

app = FastAPI(lifespan=lifespan)

@app.post("/upload")
async def upload(
    file: UploadFile = File(...),
    session: AsyncSession = Depends(get_async_session)
):
    temp_path = None
    file.filename = file.filename if file.filename else ""
    try:
        with tf.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as temp_file:
            temp_path = temp_file.name
            shutil.copyfileobj(file.file, temp_file)
        
        with open(temp_path, "rb") as f:
            upload_result = imageKit.files.upload(
                file=f,
                file_name=file.filename,
                use_unique_file_name=True,
                tags=["backend-upload"]
            )
            
        return {"url": upload_result.url}
    
    except Exception as e:
        print("Exception:", e)
        raise HTTPException(500, detail=str(e))
    finally:
        if temp_path and os.path.exists(temp_path):
            os.unlink(temp_path)
        file.file.close()