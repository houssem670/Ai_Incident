from sqlalchemy import Boolean
from sqlalchemy import Column
from sqlalchemy import DateTime
from sqlalchemy import Float
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Text

from app.database import Base


class RawLog(Base):
    __tablename__ = "raw_logs"

    id = Column(Integer, primary_key=True, index=True)

    log_type = Column(String)

    source_ip = Column(String)

    http_method = Column(String)

    request_url = Column(String)

    http_version = Column(String)

    status_code = Column(Integer)

    response_size = Column(Integer)

    referer = Column(Text)

    user_agent = Column(Text)

    raw_log = Column(Text)

    enriched = Column(Boolean, default=False)

    ai_done = Column(Boolean, default=False)

    notified = Column(Boolean, default=False)

    created_at = Column(DateTime)

    abuse_score = Column(Float)

    country = Column(String)

    isp = Column(String)

    total_reports = Column(Integer)

    risk_score = Column(Float)

    severity = Column(String)

    ollama_analysis = Column(Text)

    alert_sent = Column(Boolean, default=False)