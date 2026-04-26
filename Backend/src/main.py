from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.database import create_db_and_tables
from src.files.service import TamperingDetector
from src.auth.router import router as auth_router
from src.files.router import router as files_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_db_and_tables()
    app.state.detector = TamperingDetector(
        ckpt_path="./models/iml-vit_checkpoint.pth",
        output_size=1024,
    )
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(files_router)