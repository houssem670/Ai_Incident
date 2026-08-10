from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.raw_log import RawLog


class DashboardCRUD:

    @staticmethod
    def get_severity_distribution(db: Session):

        results = (
            db.query(
                RawLog.severity,
                func.count(RawLog.id)
            )
            .group_by(RawLog.severity)
            .all()
        )

        severity = {
            "Critical": 0,
            "High": 0,
            "Medium": 0,
            "Low": 0,
        }

        for level, count in results:

            if level in severity:
                severity[level] = count

        return severity