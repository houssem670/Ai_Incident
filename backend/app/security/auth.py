from datetime import datetime, timedelta, timezone
from typing import Any

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import jwt
from jwt.exceptions import PyJWTError
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models.user import User
from app.security.password import verify_password

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def create_access_token(subject: str, role: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {
        "sub": subject,
        "role": role,
        "exp": expire,
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def authenticate_user(db: Session, username: str, password: str) -> dict[str, str] | None:
    user = db.query(User).filter(User.username == username).first()

    if not user or not user.is_active:
        return None

    if not verify_password(password, user.password_hash):
        return None

    return {
        "username": user.username,
        "role": user.role,
    }


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        username: str | None = payload.get("sub")
        role: str | None = payload.get("role")

        if not username or not role:
            raise credentials_exception

        user = db.query(User).filter(User.username == username).first()
        if not user or not user.is_active:
            raise credentials_exception

        return {"username": user.username, "role": user.role}
    except PyJWTError as exc:
        raise credentials_exception from exc