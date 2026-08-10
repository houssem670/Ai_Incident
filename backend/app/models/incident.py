from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Text
from sqlalchemy import Float
from sqlalchemy import DateTime
from sqlalchemy import ForeignKey

from app.database import Base


class Incident(Base):

    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)

    raw_log_id = Column(
        Integer,
        ForeignKey("raw_logs.id"),
        nullable=False
    )

    title = Column(
        String,
        nullable=False
    )

    description = Column(Text)

    severity = Column(
        String,
        nullable=False
    )

    priority = Column(
        String,
        default="Medium"
    )

    status = Column(
        String,
        default="Open"
    )

    source_ip = Column(String)

    country = Column(String)

    risk_score = Column(Float)

    ai_analysis = Column(Text)

    assigned_to = Column(String)

    created_at = Column(DateTime)

    resolved_at = Column(DateTime)