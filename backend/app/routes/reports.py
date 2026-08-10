from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.report import Report
from app.security import get_current_user
from app.services.report_service import ReportService


router = APIRouter(
    prefix="/api/reports",
    tags=["Reports"]
)


# =========================================================
# GET ALL REPORTS
# =========================================================

@router.get("/")
def get_reports(
    page: int = Query(
        default=1,
        ge=1
    ),

    limit: int = Query(
        default=10,
        ge=1,
        le=100
    ),

    report_type: str | None = None,

    risk_level: str | None = None,

    db: Session = Depends(get_db),

    current_user: dict = Depends(get_current_user),
):
    return ReportService.get_reports(
        db=db,
        page=page,
        limit=limit,
        report_type=report_type,
        risk_level=risk_level,
    )


# =========================================================
# GET ONE REPORT
# =========================================================

@router.get("/{report_id}")
def get_report(
    report_id: int,

    db: Session = Depends(get_db),

    current_user: dict = Depends(get_current_user),
):
    report = ReportService.get_report(
        db=db,
        report_id=report_id
    )

    if not report:
        raise HTTPException(
            status_code=404,
            detail="Report not found"
        )

    return {
        "id": report.id,
        "title": report.title,
        "report_type": report.report_type,

        "period_start": report.period_start,
        "period_end": report.period_end,

        "total_incidents": report.total_incidents,

        "critical": report.critical,
        "high": report.high,
        "medium": report.medium,
        "low": report.low,

        "analyzed": report.analyzed,
        "pending": report.pending,

        "previous_week_total": report.previous_week_total,
        "trend": report.trend,

        "top_ip": report.top_ip,
        "top_ip_count": report.top_ip_count,
        "distinct_sources": report.distinct_sources,

        "risk_level": report.risk_level,

        "summary": report.summary,
        "risk_assessment": report.risk_assessment,

        "key_findings": report.key_findings,
        "recommendations": report.recommendations,

        "html_content": report.html_content,
        "subject": report.subject,

        "created_at": report.created_at,
    }


# =========================================================
# DELETE REPORT
# =========================================================

@router.delete("/{report_id}")
def delete_report(
    report_id: int,

    db: Session = Depends(get_db),

    current_user: dict = Depends(get_current_user),
):
    report = ReportService.delete_report(
        db=db,
        report_id=report_id
    )

    if not report:
        raise HTTPException(
            status_code=404,
            detail="Report not found"
        )

    return {
        "message": "Report deleted successfully",
        "id": report_id
    }