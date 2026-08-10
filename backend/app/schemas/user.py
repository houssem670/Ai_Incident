from typing import Optional
from pydantic import BaseModel, EmailStr


class FirstAdminCreate(BaseModel):
    username: str
    email: EmailStr
    password: str


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    role: str  # "analyst" ou "manager"


class UserUpdate(BaseModel):
    role: Optional[str] = None
    is_active: Optional[bool] = None


class UserOut(BaseModel):
    id: int
    username: str
    email: str
    role: str
    is_active: bool

    class Config:
        from_attributes = True