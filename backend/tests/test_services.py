from unittest.mock import MagicMock

from app.services.incident_history_service import IncidentHistoryService
from app.services.alert_service import AlertService


# ============================================================
# IncidentHistoryService.add
# ============================================================

def test_incident_history_add_creates_and_returns_entry():
    fake_db = MagicMock()

    result = IncidentHistoryService.add(
        db=fake_db,
        incident_id=1,
        action="status_changed",
        description="Incident escalated to critical",
        actor="analyst_1",
    )

    fake_db.add.assert_called_once()
    fake_db.commit.assert_called_once()
    fake_db.refresh.assert_called_once()

    assert result.incident_id == 1
    assert result.action == "status_changed"
    assert result.description == "Incident escalated to critical"
    assert result.actor == "analyst_1"


def test_incident_history_add_uses_default_actor():
    fake_db = MagicMock()

    result = IncidentHistoryService.add(
        db=fake_db,
        incident_id=2,
        action="created",
        description="Incident auto-created from log analysis",
    )

    assert result.actor == "System"


# ============================================================
# IncidentHistoryService.get_by_incident
# ============================================================

def test_incident_history_get_by_incident_returns_query_result():
    fake_history_entries = [MagicMock(), MagicMock()]

    fake_db = MagicMock()
    fake_db.query.return_value.filter.return_value.order_by.return_value.all.return_value = fake_history_entries

    result = IncidentHistoryService.get_by_incident(fake_db, incident_id=1)

    assert result == fake_history_entries


# ============================================================
# AlertService._serialize (via get_by_id)
# ============================================================

def _make_fake_alert(ioc_detected='["1.2.3.4", "5.6.7.8"]', recommended_actions=None):
    fake_alert = MagicMock()
    fake_alert.id = 1
    fake_alert.raw_log_id = 10
    fake_alert.source_ip = "192.168.1.1"
    fake_alert.alert_title = "Suspicious login"
    fake_alert.risk_level = "high"
    fake_alert.confidence = 0.9
    fake_alert.attack_type = "brute_force"
    fake_alert.affected_asset = "server-01"
    fake_alert.executive_summary = "summary"
    fake_alert.business_impact = "high"
    fake_alert.ioc_detected = ioc_detected
    fake_alert.recommended_actions = recommended_actions
    fake_alert.html_alert = "<p>alert</p>"
    fake_alert.sent_email = True
    fake_alert.sent_slack = False
    fake_alert.created_at = "2026-08-16T10:00:00"
    return fake_alert


def test_alert_service_get_by_id_returns_serialized_alert():
    fake_alert = _make_fake_alert()

    fake_db = MagicMock()
    fake_db.query.return_value.filter.return_value.first.return_value = fake_alert

    result = AlertService.get_by_id(fake_db, alert_id=1)

    assert result["id"] == 1
    assert result["source_ip"] == "192.168.1.1"
    assert result["ioc_detected"] == ["1.2.3.4", "5.6.7.8"]
    assert result["recommended_actions"] == []


def test_alert_service_get_by_id_returns_none_when_not_found():
    fake_db = MagicMock()
    fake_db.query.return_value.filter.return_value.first.return_value = None

    result = AlertService.get_by_id(fake_db, alert_id=999)

    assert result is None


def test_alert_service_get_all_returns_serialized_list():
    fake_alerts = [_make_fake_alert(), _make_fake_alert()]

    fake_db = MagicMock()
    fake_db.query.return_value.order_by.return_value.all.return_value = fake_alerts

    result = AlertService.get_all(fake_db)

    assert len(result) == 2
    assert all(item["id"] == 1 for item in result)


def test_alert_service_serialize_handles_invalid_json_gracefully():
    fake_alert = _make_fake_alert(ioc_detected="not-valid-json{{{")

    fake_db = MagicMock()
    fake_db.query.return_value.filter.return_value.first.return_value = fake_alert

    result = AlertService.get_by_id(fake_db, alert_id=1)

    assert result["ioc_detected"] == []