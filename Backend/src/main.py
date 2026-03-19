from contextlib import asynccontextmanager
from fastapi import FastAPI

from src.database import create_db_and_tables
from src.auth.router import router as auth_router
from src.files.router import router as files_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_db_and_tables()
    yield


app = FastAPI(lifespan=lifespan)

app.include_router(auth_router)
app.include_router(files_router)