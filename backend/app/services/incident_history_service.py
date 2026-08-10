from sqlalchemy.orm import Session

from app.models.incident_history import IncidentHistory


class IncidentHistoryService:

    @staticmethod
    def add(
        db: Session,
        incident_id: int,
        action: str,
        description: str,
        actor: str = "System",
    ):

        history = IncidentHistory(
            incident_id=incident_id,
            action=action,
            description=description,
            actor=actor,
        )

        db.add(history)
        db.commit()
        db.refresh(history)

        return history

    @staticmethod
    def get_by_incident(
        db: Session,
        incident_id: int
    ):

        return (
            db.query(IncidentHistory)
            .filter(
                IncidentHistory.incident_id == incident_id
            )
            .order_by(
                IncidentHistory.created_at.desc()
            )
            .all()
        )