from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func

from app.database import Base


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String(255), nullable=False)
    report_type = Column(String(50), nullable=False, default="weekly")

    period_start = Column(DateTime, nullable=False)
    period_end = Column(DateTime, nullable=False)

    total_incidents = Column(Integer, nullable=False, default=0)
    critical = Column(Integer, nullable=False, default=0)
    high = Column(Integer, nullable=False, default=0)
    medium = Column(Integer, nullable=False, default=0)
    low = Column(Integer, nullable=False, default=0)

    analyzed = Column(Integer, nullable=False, default=0)
    pending = Column(Integer, nullable=False, default=0)

    previous_week_total = Column(Integer, nullable=False, default=0)
    trend = Column(Integer, nullable=False, default=0)

    top_ip = Column(String(100), nullable=True)
    top_ip_count = Column(Integer, nullable=False, default=0)
    distinct_sources = Column(Integer, nullable=False, default=0)

    risk_level = Column(String(50), nullable=False)

    summary = Column(Text, nullable=True)
    risk_assessment = Column(Text, nullable=True)

    key_findings = Column(Text, nullable=True)
    recommendations = Column(Text, nullable=True)

    html_content = Column(Text, nullable=True)
    subject = Column(String(500), nullable=True)

    created_at = Column(
        DateTime,
        server_default=func.now(),
        nullable=False
    )