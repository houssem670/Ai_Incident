from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.models.raw_log import RawLog


class IncidentCRUD:

    @staticmethod
    def get_all(db: Session):

        return (
            db.query(RawLog)
            .filter(
                or_(
                    RawLog.severity.in_(["Medium", "High", "Critical"]),
                    RawLog.risk_score >= 60,
                    RawLog.alert_sent == True
                )
            )
            .order_by(RawLog.created_at.desc())
            .all()
        )

    @staticmethod
    def get_by_id(db: Session, incident_id: int):

        return (
            db.query(RawLog)
            .filter(RawLog.id == incident_id)
            .first()
        )