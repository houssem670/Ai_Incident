from sqlalchemy import Column, Integer, String, Boolean, DateTime
from datetime import datetime

from app.database import Base


class PlatformSettings(Base):
    __tablename__ = "platform_settings"

    id = Column(Integer, primary_key=True, index=True)

    platform_name = Column(String(100), nullable=False, default="SOC Command Center")

    incident_severity_threshold = Column(String(200), nullable=False, default="High,Critical")

    notifications_enabled = Column(Boolean, nullable=False, default=True)

    log_retention_days = Column(Integer, nullable=False, default=90)

    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)