from datetime import datetime

from sqlalchemy.orm import Session

from app.models.incident import Incident

from app.schemas.incident import (
    IncidentCreate,
    IncidentUpdate,
    IncidentAssign,
)

from app.services.incident_history_service import (
    IncidentHistoryService,
)


class IncidentService:

    @staticmethod
    def get_all(db: Session):

        return (
            db.query(Incident)
            .order_by(Incident.id.desc())
            .all()
        )

    @staticmethod
    def get_by_id(db: Session, incident_id: int):

        return (
            db.query(Incident)
            .filter(Incident.id == incident_id)
            .first()
        )

    @staticmethod
    def create(db: Session, incident: IncidentCreate):

        new_incident = Incident(
            raw_log_id=incident.raw_log_id,
            title=incident.title,
            description=incident.description,
            severity=incident.severity,
            priority=incident.priority,
            status=incident.status,
            source_ip=incident.source_ip,
            country=incident.country,
            risk_score=incident.risk_score,
            ai_analysis=incident.ai_analysis,
            assigned_to=incident.assigned_to,
            created_at=datetime.utcnow(),
        )

        db.add(new_incident)
        db.commit()
        db.refresh(new_incident)

        IncidentHistoryService.add(
            db=db,
            incident_id=new_incident.id,
            action="CREATED",
            description="Incident created automatically",
            actor="n8n-automation",
        )

        return new_incident

    @staticmethod
    def update(
        db: Session,
        incident_id: int,
        data: IncidentUpdate,
    ):

        incident = (
            db.query(Incident)
            .filter(Incident.id == incident_id)
            .first()
        )

        if incident is None:
            return None

        values = data.model_dump(exclude_unset=True)

        for key, value in values.items():
            setattr(incident, key, value)

        db.commit()
        db.refresh(incident)

        IncidentHistoryService.add(
            db=db,
            incident_id=incident.id,
            action="UPDATED",
            description="Incident updated",
        )

        return incident

    @staticmethod
    def update_status(
        db: Session,
        incident_id: int,
        status: str,
    ):

        incident = (
            db.query(Incident)
            .filter(Incident.id == incident_id)
            .first()
        )

        if incident is None:
            return None

        old_status = incident.status

        incident.status = status

        if status == "Resolved":
            incident.resolved_at = datetime.utcnow()

        db.commit()
        db.refresh(incident)

        IncidentHistoryService.add(
            db=db,
            incident_id=incident.id,
            action="STATUS_CHANGED",
            description=f"{old_status} → {status}",
        )

        return incident

    @staticmethod
    def assign(
        db: Session,
        incident_id: int,
        data: IncidentAssign,
    ):

        incident = (
            db.query(Incident)
            .filter(Incident.id == incident_id)
            .first()
        )

        if incident is None:
            return None

        incident.assigned_to = data.assigned_to

        db.commit()
        db.refresh(incident)

        IncidentHistoryService.add(
            db=db,
            incident_id=incident.id,
            action="ASSIGNED",
            description=f"Assigned to {data.assigned_to}",
        )

        return incident

    @staticmethod
    def delete(
        db: Session,
        incident_id: int,
    ):

        incident = (
            db.query(Incident)
            .filter(Incident.id == incident_id)
            .first()
        )

        if incident is None:
            return False

        from app.models.incident_history import IncidentHistory

        db.query(IncidentHistory).filter(
            IncidentHistory.incident_id == incident_id
        ).delete()

        db.delete(incident)
        db.commit()

        return True