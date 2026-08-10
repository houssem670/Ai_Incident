from datetime import datetime, timedelta

from sqlalchemy import desc, func

from app.models.incident import Incident
from app.models.raw_log import RawLog
from app.models.url_scan import UrlScan
from app.models.alert import Alert


class DashboardService:

    @staticmethod
    def get_dashboard(db):
        today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)

        return {
            "total_logs": db.query(RawLog).count(),
            "logs_today": db.query(RawLog).filter(RawLog.created_at >= today_start).count(),
            "critical_incidents": db.query(Incident).filter(func.lower(Incident.severity) == "critical").count(),
            "ioc_detected": db.query(RawLog).filter(RawLog.total_reports > 0).count(),
            "url_analyzed": db.query(UrlScan).count(),
            "alerts_sent": db.query(Alert).count(),
        }

    @staticmethod
    def get_severity(db):
        result = (
            db.query(
                RawLog.severity,
                func.count(RawLog.id)
            )
            .filter(RawLog.severity.isnot(None))
            .group_by(RawLog.severity)
            .order_by(func.count(RawLog.id).desc())
            .all()
        )

        return [
            {
                "severity": severity,
                "count": count
            }
            for severity, count in result
        ]

    @staticmethod
    def get_status(db):
        result = (
            db.query(
                RawLog.status_code,
                func.count(RawLog.id)
            )
            .filter(RawLog.status_code.isnot(None))
            .group_by(RawLog.status_code)
            .order_by(RawLog.status_code)
            .all()
        )

        return [
            {
                "status_code": status,
                "count": count
            }
            for status, count in result
        ]

    @staticmethod
    def get_top_ips(db):
        result = (
            db.query(
                RawLog.source_ip,
                func.count(RawLog.id)
            )
            .filter(RawLog.source_ip.isnot(None))
            .group_by(RawLog.source_ip)
            .order_by(func.count(RawLog.id).desc())
            .limit(10)
            .all()
        )

        return [
            {
                "ip": ip,
                "count": count
            }
            for ip, count in result
        ]

    @staticmethod
    def get_top_urls(db):
        result = (
            db.query(
                RawLog.request_url,
                func.count(RawLog.id)
            )
            .filter(RawLog.request_url.isnot(None))
            .group_by(RawLog.request_url)
            .order_by(func.count(RawLog.id).desc())
            .limit(10)
            .all()
        )

        return [
            {
                "url": url,
                "count": count
            }
            for url, count in result
        ]

    @staticmethod
    def get_country_distribution(db):
        result = (
            db.query(
                RawLog.country,
                func.count(RawLog.id)
            )
            .filter(RawLog.country.isnot(None))
            .group_by(RawLog.country)
            .order_by(func.count(RawLog.id).desc())
            .limit(10)
            .all()
        )

        return [
            {
                "country": country,
                "count": count
            }
            for country, count in result
        ]

    @staticmethod
    def get_timeline(db, range: str = "24h"):
        now = datetime.utcnow()

        if range == "7d":
            start = now - timedelta(days=7)
            trunc = "day"
        elif range == "30d":
            start = now - timedelta(days=30)
            trunc = "day"
        else:
            start = now - timedelta(hours=24)
            trunc = "hour"

        result = (
            db.query(
                func.date_trunc(trunc, RawLog.created_at).label("period"),
                func.count(RawLog.id)
            )
            .filter(RawLog.created_at >= start)
            .group_by("period")
            .order_by("period")
            .all()
        )

        return [
            {
                "time": period.strftime("%H:%M") if trunc == "hour" else period.strftime("%Y-%m-%d") if period else "",
                "count": count
            }
            for period, count in result
        ]

    @staticmethod
    def get_recent_logs(db):
        logs = (
            db.query(RawLog)
            .order_by(desc(RawLog.created_at))
            .limit(20)
            .all()
        )

        return [
            {
                "id": log.id,
                "created_at": log.created_at,
                "source_ip": log.source_ip,
                "request_url": log.request_url,
                "severity": log.severity,
                "risk_score": log.risk_score,
                "status_code": log.status_code,
                "ai_analyzed": bool(log.ai_done),
                "notification_sent": bool(log.alert_sent),
            }
            for log in logs
        ]