from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from app.models.settings import PlatformSettings
from app.models.raw_log import RawLog


class SettingsService:

    @staticmethod
    def get(db: Session) -> PlatformSettings:
        settings = db.query(PlatformSettings).first()

        if settings is None:
            settings = PlatformSettings()
            db.add(settings)
            db.commit()
            db.refresh(settings)

        return settings

    @staticmethod
    def get_as_dict(db: Session) -> dict:
        settings = SettingsService.get(db)
        return {
            "id": settings.id,
            "platform_name": settings.platform_name,
            "incident_severity_threshold": settings.incident_severity_threshold.split(","),
            "notifications_enabled": settings.notifications_enabled,
            "log_retention_days": settings.log_retention_days,
            "updated_at": settings.updated_at,
        }

    @staticmethod
    def update(db: Session, data: dict) -> PlatformSettings:
        settings = SettingsService.get(db)

        if "platform_name" in data and data["platform_name"] is not None:
            settings.platform_name = data["platform_name"]

        if "incident_severity_threshold" in data and data["incident_severity_threshold"] is not None:
            settings.incident_severity_threshold = ",".join(data["incident_severity_threshold"])

        if "notifications_enabled" in data and data["notifications_enabled"] is not None:
            settings.notifications_enabled = data["notifications_enabled"]

        if "log_retention_days" in data and data["log_retention_days"] is not None:
            settings.log_retention_days = data["log_retention_days"]

        db.commit()
        db.refresh(settings)

        return settings

    @staticmethod
    def is_severity_allowed(db: Session, severity: str) -> bool:
        settings = SettingsService.get(db)
        allowed = [s.strip().lower() for s in settings.incident_severity_threshold.split(",")]
        return severity.strip().lower() in allowed

    @staticmethod
    def purge_old_logs(db: Session) -> int:
        settings = SettingsService.get(db)
        cutoff = datetime.utcnow() - timedelta(days=settings.log_retention_days)

        deleted = (
            db.query(RawLog)
            .filter(RawLog.created_at < cutoff)
            .delete(synchronize_session=False)
        )

        db.commit()

        return deleted