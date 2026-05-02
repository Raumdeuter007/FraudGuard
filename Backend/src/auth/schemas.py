import uuid
from pydantic import EmailStr, Field
from fastapi_users import schemas

class UserRead(schemas.BaseUser[uuid.UUID]):
    name: str

class UserCreate(schemas.CreateUpdateDictModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    name: str = Field(min_length=1, max_length=50)

class UserUpdate(schemas.BaseUserUpdate):
    name: str