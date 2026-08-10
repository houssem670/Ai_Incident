from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from fastapi import Query

from sqlalchemy.orm import Session

from app.database import get_db
from app.models.raw_log import RawLog
from app.security import get_current_user
from app.services.log_service import LogsService
from app.security import get_current_user

router = APIRouter(
    prefix="/api/logs",
    tags=["Logs"]
)


@router.get("/")
def get_logs(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
    severity: str = None,
    source_ip: str = None,
    country: str = None,
    status_code: int = None,
    log_type: str = None,
    date_from: str = None,
    date_to: str = None,
    search: str = None,
    sort_field: str = Query(default="created_at"),
    sort_order: str = Query(default="desc"),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):

    return LogsService.get_logs(
        db=db,
        page=page,
        limit=limit,
        severity=severity,
        source_ip=source_ip,
        country=country,
        status_code=status_code,
        log_type=log_type,
        date_from=date_from,
        date_to=date_to,
        search=search,
        sort_field=sort_field,
        sort_order=sort_order
    )


@router.get("/{log_id}")
def get_log(
    log_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):

    log = (
        db.query(RawLog)
        .filter(RawLog.id == log_id)
        .first()
    )

    if not log:
        raise HTTPException(
            status_code=404,
            detail="Log not found"
        )

    return {
        "id": log.id,
        "log_type": log.log_type,
        "source_ip": log.source_ip,
        "http_method": log.http_method,
        "request_url": log.request_url,
        "http_version": log.http_version,
        "status_code": log.status_code,
        "response_size": log.response_size,
        "referer": log.referer,
        "user_agent": log.user_agent,
        "raw_log": log.raw_log,
        "enriched": log.enriched,
        "ai_done": log.ai_done,
        "notified": log.notified,
        "created_at": log.created_at,
        "abuse_score": log.abuse_score,
        "country": log.country,
        "isp": log.isp,
        "total_reports": log.total_reports,
        "risk_score": log.risk_score,
        "severity": log.severity,
        "ollama_analysis": log.ollama_analysis,
        "alert_sent": log.alert_sent,
    }

@router.get("/statistics")
def get_statistics(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return LogsService.get_statistics(db)

@router.get("/dashboard")
def dashboard_summary(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return {
        "total_logs": db.query(RawLog).count(),

        "critical_logs": db.query(RawLog)
        .filter(RawLog.severity == "Critical")
        .count(),

        "high_logs": db.query(RawLog)
        .filter(RawLog.severity == "High")
        .count(),

        "medium_logs": db.query(RawLog)
        .filter(RawLog.severity == "Medium")
        .count(),

        "low_logs": db.query(RawLog)
        .filter(RawLog.severity == "Low")
        .count(),

        "alerts_sent": db.query(RawLog)
        .filter(RawLog.alert_sent == True)
        .count(),
    }

@router.get("/filters")
def get_filters(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):

    severities = [
        x[0]
        for x in db.query(RawLog.severity)
        .distinct()
        .all()
        if x[0]
    ]

    countries = [
        x[0]
        for x in db.query(RawLog.country)
        .distinct()
        .all()
        if x[0]
    ]

    log_types = [
        x[0]
        for x in db.query(RawLog.log_type)
        .distinct()
        .all()
        if x[0]
    ]

    return {
        "severities": severities,
        "countries": countries,
        "log_types": log_types,
    }