from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class IncidentCreate(BaseModel):

    raw_log_id: int

    title: str

    description: str

    severity: str

    priority: str = "Medium"

    status: str = "Open"

    source_ip: str

    country: Optional[str] = None

    risk_score: float

    ai_analysis: Optional[str] = None

    assigned_to: Optional[str] = None


class IncidentUpdate(BaseModel):

    title: Optional[str] = None

    description: Optional[str] = None

    severity: Optional[str] = None

    priority: Optional[str] = None

    status: Optional[str] = None

    assigned_to: Optional[str] = None


class IncidentResponse(BaseModel):

    id: int

    raw_log_id: int

    title: str

    description: str

    severity: str

    priority: str

    status: str

    source_ip: str

    country: Optional[str]

    risk_score: float

    ai_analysis: Optional[str]

    assigned_to: Optional[str]

    created_at: Optional[datetime]

    resolved_at: Optional[datetime]

    class Config:
        from_attributes = True


class IncidentAssign(BaseModel):

    assigned_to: str