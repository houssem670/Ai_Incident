from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.security import get_current_user, require_admin
from app.services.settings_service import SettingsService
from app.schemas.settings import SettingsOut, SettingsUpdate
from app.config import settings as app_settings

router = APIRouter(prefix="/api/settings", tags=["Settings"])


@router.get("", response_model=SettingsOut)
def get_settings(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return SettingsService.get_as_dict(db)


@router.put("", response_model=SettingsOut)
def update_settings(
    payload: SettingsUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_admin),
):
    SettingsService.update(db, payload.model_dump(exclude_unset=True))
    return SettingsService.get_as_dict(db)


@router.post("/purge-logs")
def purge_logs(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_admin),
):
    deleted_count = SettingsService.purge_old_logs(db)
    return {"deleted": deleted_count}


@router.get("/internal-api-key")
def get_internal_api_key(
    current_user: dict = Depends(require_admin),
):
    key = app_settings.INTERNAL_API_KEY
    masked = key[:4] + "•" * (len(key) - 8) + key[-4:] if len(key) > 8 else "••••••••"

    return {
        "masked": masked,
        "full": key,
    }

@router.get("/public")
def get_public_settings(db: Session = Depends(get_db)):
    settings = SettingsService.get(db)
    return {"platform_name": settings.platform_name}