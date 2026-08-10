from fastapi import Header, HTTPException, status

from app.config import settings


def verify_internal_key(x_api_key: str = Header(None)):
    print(f"[DEBUG] Received header: {repr(x_api_key)}")
    print(f"[DEBUG] Expected key:    {repr(settings.INTERNAL_API_KEY)}")
    print(f"[DEBUG] Match: {x_api_key == settings.INTERNAL_API_KEY}")

    if x_api_key != settings.INTERNAL_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid internal API key",
        )
    return True