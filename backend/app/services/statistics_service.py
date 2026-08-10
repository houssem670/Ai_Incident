from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.raw_log import RawLog


class StatisticsService:

    @staticmethod
    def get_statistics(db: Session):

        severity = (
            db.query(
                RawLog.severity,
                func.count(RawLog.id)
            )
            .group_by(RawLog.severity)
            .all()
        )

        status = (
            db.query(
                RawLog.status_code,
                func.count(RawLog.id)
            )
            .group_by(RawLog.status_code)
            .all()
        )

        top_ips = (
            db.query(
                RawLog.source_ip,
                func.count(RawLog.id)
            )
            .group_by(RawLog.source_ip)
            .order_by(func.count(RawLog.id).desc())
            .limit(10)
            .all()
        )

        return {
            "severity": [
                {
                    "severity": s,
                    "count": c
                }
                for s, c in severity
            ],

            "status_code": [
                {
                    "status_code": s,
                    "count": c
                }
                for s, c in status
            ],

            "top_ips": [
                {
                    "source_ip": ip,
                    "count": c
                }
                for ip, c in top_ips
            ]
        }