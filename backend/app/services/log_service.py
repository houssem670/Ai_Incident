from sqlalchemy import or_
from app.models.raw_log import RawLog


class LogsService:

    @staticmethod
    def get_logs(
        db,
        page: int = 1,
        limit: int = 20,
        search: str = None,
        severity: str = None,
        source_ip: str = None,
        country: str = None,
        status_code: int = None,
        log_type: str = None,
        date_from: str = None,
        date_to: str = None,
        sort_field: str = "created_at",
        sort_order: str = "desc",
    ):
        """
        Return paginated logs with filters.
        """

        query = db.query(RawLog)

        # -------------------------
        # Search
        # -------------------------
        if search:
            query = query.filter(
                or_(
                    RawLog.source_ip.ilike(f"%{search}%"),
                    RawLog.request_url.ilike(f"%{search}%"),
                    RawLog.user_agent.ilike(f"%{search}%"),
                    RawLog.country.ilike(f"%{search}%"),
                    RawLog.raw_log.ilike(f"%{search}%"),
                )
            )

        # -------------------------
        # Filters
        # -------------------------
        if severity:
            query = query.filter(RawLog.severity == severity)

        if source_ip:
            query = query.filter(
                RawLog.source_ip.ilike(f"%{source_ip}%")
            )

        if country:
            query = query.filter(
                RawLog.country == country
            )

        if status_code:
            query = query.filter(
                RawLog.status_code == status_code
            )

        if log_type:
            query = query.filter(
                RawLog.log_type == log_type
            )

        if date_from:
            query = query.filter(
                RawLog.created_at >= date_from
            )

        if date_to:
            query = query.filter(
                RawLog.created_at <= date_to
            )

        # -------------------------
        # Sorting
        # -------------------------
        sort_column = getattr(
            RawLog,
            sort_field,
            RawLog.created_at
        )

        if sort_order.lower() == "asc":
            query = query.order_by(sort_column.asc())
        else:
            query = query.order_by(sort_column.desc())

        total = query.count()

        logs = (
            query
            .offset((page - 1) * limit)
            .limit(limit)
            .all()
        )

        return {
            "data": logs,
            "total": total,
            "page": page,
            "limit": limit,
        }

    @staticmethod
    def get_statistics(db):
        """
        Dashboard statistics.
        """

        total_logs = db.query(RawLog).count()

        critical_logs = (
            db.query(RawLog)
            .filter(RawLog.severity == "Critical")
            .count()
        )

        enriched_logs = (
            db.query(RawLog)
            .filter(RawLog.enriched == True)
            .count()
        )

        ai_logs = (
            db.query(RawLog)
            .filter(RawLog.ai_done == True)
            .count()
        )

        notified_logs = (
            db.query(RawLog)
            .filter(RawLog.notified == True)
            .count()
        )

        return {
            "total_logs": total_logs,
            "critical_logs": critical_logs,
            "enriched_logs": enriched_logs,
            "ai_logs": ai_logs,
            "notified_logs": notified_logs,
        }