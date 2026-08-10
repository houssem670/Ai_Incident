from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.security import get_current_user
from app.services.dashboard_service import DashboardService

router = APIRouter(
    prefix="/api/dashboard",
    tags=["Dashboard"]
)


@router.get("/")
def dashboard(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return DashboardService.get_dashboard(db)


@router.get("/severity")
def severity(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return DashboardService.get_severity(db)


@router.get("/status")
def status(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return DashboardService.get_status(db)


@router.get("/top-ips")
def top_ips(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return DashboardService.get_top_ips(db)


@router.get("/top-urls")
def top_urls(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return DashboardService.get_top_urls(db)


@router.get("/countries")
def countries(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return DashboardService.get_country_distribution(db)


@router.get("/timeline")
def timeline(
    range: str = Query(default="24h", regex="^(24h|7d|30d)$"),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return DashboardService.get_timeline(db, range=range)


@router.get("/recent-logs")
def recent_logs(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return DashboardService.get_recent_logs(db)

