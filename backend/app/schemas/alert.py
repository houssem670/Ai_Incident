from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel


class AlertOut(BaseModel):
    id: int
    raw_log_id: Optional[int]
    source_ip: Optional[str]
    alert_title: Optional[str]
    risk_level: Optional[str]
    confidence: Optional[str]
    attack_type: Optional[str]
    affected_asset: Optional[str]
    executive_summary: Optional[str]
    business_impact: Optional[str]
    ioc_detected: Optional[List[str]] = []
    recommended_actions: Optional[List[str]] = []
    html_alert: Optional[str]
    sent_email: bool
    sent_slack: bool
    created_at: Optional[datetime]

    class Config:
        from_attributes = True