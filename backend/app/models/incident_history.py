from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime

from app.database import Base


class IncidentHistory(Base):

    __tablename__ = "incident_history"


    id = Column(
        Integer,
        primary_key=True,
        index=True
    )


    incident_id = Column(
        Integer,
        nullable=False
    )


    action = Column(
        String(100),
        nullable=False
    )


    description = Column(
        Text,
        nullable=True
    )


    actor = Column(
        String(100),
        nullable=False,
        default="System"
    )


    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )