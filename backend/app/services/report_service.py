from sqlalchemy.orm import Session

from app.models.report import Report


class ReportService:

    @staticmethod
    def get_reports(
        db: Session,
        page: int = 1,
        limit: int = 10,
        report_type: str | None = None,
        risk_level: str | None = None,
    ):
        query = db.query(Report)

        # -------------------------
        # Filters
        # -------------------------

        if report_type:
            query = query.filter(
                Report.report_type == report_type
            )

        if risk_level:
            query = query.filter(
                Report.risk_level == risk_level
            )

        # -------------------------
        # Total
        # -------------------------

        total = query.count()

        # -------------------------
        # Sorting
        # -------------------------

        query = query.order_by(
            Report.created_at.desc()
        )

        # -------------------------
        # Pagination
        # -------------------------

        reports = (
            query
            .offset((page - 1) * limit)
            .limit(limit)
            .all()
        )

        return {
            "data": reports,
            "total": total,
            "page": page,
            "limit": limit,
        }

    @staticmethod
    def get_report(
        db: Session,
        report_id: int
    ):
        return (
            db.query(Report)
            .filter(Report.id == report_id)
            .first()
        )

    @staticmethod
    def delete_report(
        db: Session,
        report_id: int
    ):
        report = (
            db.query(Report)
            .filter(Report.id == report_id)
            .first()
        )

        if not report:
            return None

        db.delete(report)
        db.commit()

        return report