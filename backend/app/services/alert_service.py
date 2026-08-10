import json
from sqlalchemy.orm import Session

from app.models.alert import Alert


class AlertService:

    @staticmethod
    def get_all(db: Session):
        alerts = (
            db.query(Alert)
            .order_by(Alert.created_at.desc())
            .all()
        )
        return [AlertService._serialize(a) for a in alerts]

    @staticmethod
    def get_by_id(db: Session, alert_id: int):
        alert = db.query(Alert).filter(Alert.id == alert_id).first()
        if alert is None:
            return None
        return AlertService._serialize(alert)

    @staticmethod
    def _serialize(alert: Alert) -> dict:
        def safe_json_list(value):
            if not value:
                return []
            try:
                parsed = json.loads(value)
                return parsed if isinstance(parsed, list) else []
            except (json.JSONDecodeError, TypeError):
                return []

        return {
            "id": alert.id,
            "raw_log_id": alert.raw_log_id,
            "source_ip": alert.source_ip,
            "alert_title": alert.alert_title,
            "risk_level": alert.risk_level,
            "confidence": alert.confidence,
            "attack_type": alert.attack_type,
            "affected_asset": alert.affected_asset,
            "executive_summary": alert.executive_summary,
            "business_impact": alert.business_impact,
            "ioc_detected": safe_json_list(alert.ioc_detected),
            "recommended_actions": safe_json_list(alert.recommended_actions),
            "html_alert": alert.html_alert,
            "sent_email": alert.sent_email,
            "sent_slack": alert.sent_slack,
            "created_at": alert.created_at,
        }