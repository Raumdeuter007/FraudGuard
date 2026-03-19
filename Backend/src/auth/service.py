import uuid

from src.auth.models import User
from src.auth import config as auth_config
from fastapi_users import BaseUserManager, UUIDIDMixin


class UserManager(UUIDIDMixin, BaseUserManager[User, uuid.UUID]):
    reset_password_token_secret = auth_config.SECRET
    verification_token_secret = auth_config.SECRET
