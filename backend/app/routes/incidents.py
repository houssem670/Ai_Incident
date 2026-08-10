from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.incident import IncidentCreate, IncidentUpdate
from app.security import get_current_user
from app.services.incident_service import IncidentService
from app.schemas.incident import IncidentAssign
from app.services.incident_history_service import IncidentHistoryService
from app.security.service_auth import verify_internal_key



router = APIRouter(
    prefix="/api/incidents",
    tags=["Incidents"]
)


# ==========================
# GET ALL INCIDENTS
# ==========================

@router.get("/")
def get_incidents(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return IncidentService.get_all(db)


# ==========================
# GET ONE INCIDENT
# ==========================

@router.get("/{incident_id}")
def get_incident(
    incident_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):

    incident = IncidentService.get_by_id(
        db,
        incident_id
    )

    if incident is None:
        raise HTTPException(
            status_code=404,
            detail="Incident not found"
        )

    return incident


# ==========================
# CREATE INCIDENT
# ==========================

@router.post("/")
def create_incident(
    incident: IncidentCreate,
    db: Session = Depends(get_db),
    _: bool = Depends(verify_internal_key),
):
    from app.services.settings_service import SettingsService

    if not SettingsService.is_severity_allowed(db, incident.severity):
        return {
            "skipped": True,
            "reason": f"Severity '{incident.severity}' is below the configured threshold.",
        }

    return IncidentService.create(
        db,
        incident
    )


# ==========================
# UPDATE INCIDENT
# ==========================

@router.put("/{incident_id}")
def update_incident(
    incident_id: int,
    data: IncidentUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):

    incident = IncidentService.update(
        db,
        incident_id,
        data
    )

    if incident is None:
        raise HTTPException(
            status_code=404,
            detail="Incident not found"
        )

    return incident


# ==========================
# UPDATE STATUS
# ==========================

@router.patch("/{incident_id}/status")
def update_status(
    incident_id: int,
    status: str = Body(...),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):

    incident = IncidentService.update_status(
        db,
        incident_id,
        status
    )

    if incident is None:
        raise HTTPException(
            status_code=404,
            detail="Incident not found"
        )

    return incident

@router.patch("/{incident_id}/assign")
def assign_incident(

    incident_id: int,

    data: IncidentAssign,

    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),

):

    incident = IncidentService.assign(

        db,

        incident_id,

        data

    )

    if incident is None:

        raise HTTPException(

            status_code=404,

            detail="Incident not found"

        )

    return incident


# ==========================
# DELETE INCIDENT
# ==========================

@router.delete("/{incident_id}")
def delete_incident(
    incident_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):

    success = IncidentService.delete(
        db,
        incident_id
    )

    if not success:
        raise HTTPException(
            status_code=404,
            detail="Incident not found"
        )

    return {
        "message": "Incident deleted successfully"
    }

@router.get("/{incident_id}/history")
def get_incident_history(
    incident_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):

    history = IncidentHistoryService.get_by_incident(
        db,
        incident_id
    )


    return history