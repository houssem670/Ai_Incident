from unittest.mock import MagicMock

import jwt
import pytest
from fastapi import HTTPException

from app.config import settings
from app.security.auth import (
    authenticate_user,
    create_access_token,
    get_current_user,
)
from app.security.password import hash_password


# ============================================================
# create_access_token
# ============================================================

def test_create_access_token_returns_valid_jwt():
    token = create_access_token(subject="john_doe", role="admin")

    assert isinstance(token, str)

    payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    assert payload["sub"] == "john_doe"
    assert payload["role"] == "admin"
    assert "exp" in payload


# ============================================================
# authenticate_user
# ============================================================

def _make_fake_user(username="john_doe", role="analyst", is_active=True, password="secret123"):
    fake_user = MagicMock()
    fake_user.username = username
    fake_user.role = role
    fake_user.is_active = is_active
    fake_user.password_hash = hash_password(password)
    return fake_user


def test_authenticate_user_success():
    fake_user = _make_fake_user(password="secret123")

    fake_db = MagicMock()
    fake_db.query.return_value.filter.return_value.first.return_value = fake_user

    result = authenticate_user(fake_db, "john_doe", "secret123")

    assert result == {"username": "john_doe", "role": "analyst"}


def test_authenticate_user_wrong_password_returns_none():
    fake_user = _make_fake_user(password="secret123")

    fake_db = MagicMock()
    fake_db.query.return_value.filter.return_value.first.return_value = fake_user

    result = authenticate_user(fake_db, "john_doe", "wrong_password")

    assert result is None


def test_authenticate_user_unknown_username_returns_none():
    fake_db = MagicMock()
    fake_db.query.return_value.filter.return_value.first.return_value = None

    result = authenticate_user(fake_db, "unknown_user", "whatever")

    assert result is None


def test_authenticate_user_inactive_account_returns_none():
    fake_user = _make_fake_user(is_active=False, password="secret123")

    fake_db = MagicMock()
    fake_db.query.return_value.filter.return_value.first.return_value = fake_user

    result = authenticate_user(fake_db, "john_doe", "secret123")

    assert result is None


# ============================================================
# get_current_user
# ============================================================

@pytest.mark.asyncio
async def test_get_current_user_success():
    fake_user = _make_fake_user(username="john_doe", role="analyst")

    fake_db = MagicMock()
    fake_db.query.return_value.filter.return_value.first.return_value = fake_user

    token = create_access_token(subject="john_doe", role="analyst")

    result = await get_current_user(token=token, db=fake_db)

    assert result == {"username": "john_doe", "role": "analyst"}


@pytest.mark.asyncio
async def test_get_current_user_invalid_token_raises_401():
    fake_db = MagicMock()

    with pytest.raises(HTTPException) as exc_info:
        await get_current_user(token="this-is-not-a-valid-jwt", db=fake_db)

    assert exc_info.value.status_code == 401


@pytest.mark.asyncio
async def test_get_current_user_unknown_user_raises_401():
    fake_db = MagicMock()
    fake_db.query.return_value.filter.return_value.first.return_value = None

    token = create_access_token(subject="ghost_user", role="analyst")

    with pytest.raises(HTTPException) as exc_info:
        await get_current_user(token=token, db=fake_db)

    assert exc_info.value.status_code == 401


@pytest.mark.asyncio
async def test_get_current_user_inactive_user_raises_401():
    fake_user = _make_fake_user(username="john_doe", role="analyst", is_active=False)

    fake_db = MagicMock()
    fake_db.query.return_value.filter.return_value.first.return_value = fake_user

    token = create_access_token(subject="john_doe", role="analyst")

    with pytest.raises(HTTPException) as exc_info:
        await get_current_user(token=token, db=fake_db)

    assert exc_info.value.status_code == 401