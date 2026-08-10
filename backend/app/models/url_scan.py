from sqlalchemy import Column, Integer, String, Numeric, Text, DateTime
from app.database import Base


class UrlScan(Base):
    __tablename__ = "url_scans"

    id = Column(Integer, primary_key=True, index=True)
    incident_id = Column(Integer, nullable=True)
    url = Column(String(2083), nullable=False)
    status = Column(String(50), nullable=False)
    findings = Column(Text, nullable=True)
    score = Column(Numeric(5, 2), nullable=True)
    vt_score = Column(Integer, nullable=True)
    urlscan_score = Column(Integer, nullable=True)
    nuclei_score = Column(Integer, nullable=True)
    risk_score = Column(Integer, nullable=True)
    severity = Column(String(50), nullable=True)
    scanned_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, nullable=False)
    updated_at = Column(DateTime, nullable=False)