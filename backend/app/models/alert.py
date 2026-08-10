from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from datetime import datetime

from app.database import Base


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    raw_log_id = Column(Integer, nullable=True)
    source_ip = Column(String(100), nullable=True)
    alert_title = Column(String(255), nullable=True)
    risk_level = Column(String(50), nullable=True)
    confidence = Column(String(50), nullable=True)
    attack_type = Column(String(255), nullable=True)
    affected_asset = Column(String(255), nullable=True)
    executive_summary = Column(Text, nullable=True)
    business_impact = Column(Text, nullable=True)
    ioc_detected = Column(Text, nullable=True)
    recommended_actions = Column(Text, nullable=True)
    html_alert = Column(Text, nullable=True)
    sent_email = Column(Boolean, default=False)
    sent_slack = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)