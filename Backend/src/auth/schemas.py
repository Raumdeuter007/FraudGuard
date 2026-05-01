import uuid
from pydantic import EmailStr
from fastapi_users import schemas

class UserRead(schemas.BaseUser[uuid.UUID]):
    name: str

class UserCreate(schemas.CreateUpdateDictModel):
    email: EmailStr
    password: str
    name: str

class UserUpdate(schemas.BaseUserUpdate):
    name: str