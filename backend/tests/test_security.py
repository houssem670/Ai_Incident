import pytest
from fastapi import HTTPException

from app.security.password import hash_password, verify_password
from app.security.service_auth import verify_internal_key
from app.security.permissions import require_admin
from app.config import settings


# ============================================================
# password.py
# ============================================================

def test_hash_password_returns_different_string_than_input():
    hashed = hash_password("MySecretPassword123")
    assert hashed != "MySecretPassword123"
    assert isinstance(hashed, str)
    assert len(hashed) > 0


def test_verify_password_success():
    plain = "MySecretPassword123"
    hashed = hash_password(plain)
    assert verify_password(plain, hashed) is True


def test_verify_password_failure():
    hashed = hash_password("MySecretPassword123")
    assert verify_password("WrongPassword", hashed) is False


# ============================================================
# service_auth.py
# ============================================================

def test_verify_internal_key_success():
    result = verify_internal_key(x_api_key=settings.INTERNAL_API_KEY)
    assert result is True


def test_verify_internal_key_failure_raises_401():
    with pytest.raises(HTTPException) as exc_info:
        verify_internal_key(x_api_key="wrong-key-value")
    assert exc_info.value.status_code == 401
    assert exc_info.value.detail == "Invalid internal API key"


def test_verify_internal_key_missing_header_raises_401():
    with pytest.raises(HTTPException) as exc_info:
        verify_internal_key(x_api_key=None)
    assert exc_info.value.status_code == 401


# ============================================================
# permissions.py
# ============================================================

@pytest.mark.asyncio
async def test_require_admin_success_for_admin_role():
    admin_user = {"username": "admin_user", "role": "admin"}
    result = await require_admin(current_user=admin_user)
    assert result == admin_user


@pytest.mark.asyncio
async def test_require_admin_raises_403_for_non_admin_role():
    regular_user = {"username": "regular_user", "role": "analyst"}
    with pytest.raises(HTTPException) as exc_info:
        await require_admin(current_user=regular_user)
    assert exc_info.value.status_code == 403
    assert exc_info.value.detail == "Administrator privileges required."