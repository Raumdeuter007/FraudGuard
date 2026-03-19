import os
from dotenv import load_dotenv

load_dotenv()

IMAGEKIT_PRIVATE_KEY: str = os.getenv("IMAGEKIT_PRIVATE_KEY", "")
IMAGEKIT_URL_ENDPOINT: str = os.getenv("IMAGEKIT_URL", "")