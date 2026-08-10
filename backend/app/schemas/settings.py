from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, field_validator


class SettingsOut(BaseModel):
    id: int
    platform_name: str
    incident_severity_threshold: List[str]
    notifications_enabled: bool
    log_retention_days: int
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


class SettingsUpdate(BaseModel):
    platform_name: Optional[str] = None
    incident_severity_threshold: Optional[List[str]] = None
    notifications_enabled: Optional[bool] = None
    log_retention_days: Optional[int] = None

    @field_validator("log_retention_days")
    @classmethod
    def validate_retention(cls, v):
        if v is not None and v < 1:
            raise ValueError("log_retention_days must be at least 1")
        return v