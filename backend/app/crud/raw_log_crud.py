from datetime import datetime

from sqlalchemy import asc, desc, or_
from sqlalchemy.orm import Session

from app.models.raw_log import RawLog


class RawLogCRUD:

    @staticmethod
    def get_logs(
        db: Session,
        page: int,
        limit: int,
        severity: str = None,
        source_ip: str = None,
        country: str = None,
        status_code: int = None,
        log_type: str = None,
        date_from: str = None,
        date_to: str = None,
        search: str = None,
        sort_field: str = "created_at",
        sort_order: str = "desc"
    ):

        query = db.query(RawLog)

        if severity:
            query = query.filter(RawLog.severity == severity)

        if source_ip:
            query = query.filter(RawLog.source_ip == source_ip)

        if country:
            query = query.filter(RawLog.country == country)

        if status_code is not None:
            query = query.filter(RawLog.status_code == status_code)

        if log_type:
            query = query.filter(RawLog.log_type == log_type)

        if date_from:
            try:
                query = query.filter(RawLog.created_at >= datetime.fromisoformat(date_from))
            except ValueError:
                pass

        if date_to:
            try:
                query = query.filter(RawLog.created_at <= datetime.fromisoformat(date_to))
            except ValueError:
                pass

        if search:
            search_term = f"%{search}%"
            query = query.filter(
                or_(
                    RawLog.source_ip.ilike(search_term),
                    RawLog.log_type.ilike(search_term),
                    RawLog.request_url.ilike(search_term),
                    RawLog.country.ilike(search_term),
                    RawLog.raw_log.ilike(search_term),
                    RawLog.user_agent.ilike(search_term),
                    RawLog.severity.ilike(search_term),
                    RawLog.ollama_analysis.ilike(search_term)
                )
            )

        allowed_sort_fields = {
            "created_at": RawLog.created_at,
            "source_ip": RawLog.source_ip,
            "log_type": RawLog.log_type,
            "request_url": RawLog.request_url,
            "status_code": RawLog.status_code,
            "country": RawLog.country,
            "risk_score": RawLog.risk_score,
            "severity": RawLog.severity,
            "enriched": RawLog.enriched,
            "ai_done": RawLog.ai_done,
            "notified": RawLog.notified,
        }

        sort_column = allowed_sort_fields.get(sort_field, RawLog.created_at)
        sort_direction = asc(sort_column) if str(sort_order).lower() == "asc" else desc(sort_column)

        total = query.count()

        logs = (
            query
            .order_by(sort_direction)
            .offset((page - 1) * limit)
            .limit(limit)
            .all()
        )

        return total, logs