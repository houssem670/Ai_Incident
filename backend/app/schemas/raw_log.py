from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class RawLogResponse(BaseModel):

    id: int

    log_type: Optional[str]

    source_ip: Optional[str]

    http_method: Optional[str]

    request_url: Optional[str]

    http_version: Optional[str]

    status_code: Optional[int]

    response_size: Optional[int]

    referer: Optional[str]

    user_agent: Optional[str]

    raw_log: Optional[str]

    enriched: bool

    ai_done: bool

    notified: bool

    created_at: Optional[datetime]

    abuse_score: Optional[float]

    country: Optional[str]

    isp: Optional[str]

    total_reports: Optional[int]

    risk_score: Optional[float]

    severity: Optional[str]

    ollama_analysis: Optional[str]

    alert_sent: bool

    class Config:
        from_attributes = True