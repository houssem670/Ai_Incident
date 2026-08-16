from unittest.mock import MagicMock, patch

from app.services.settings_service import SettingsService
from app.services.report_service import ReportService


# ============================================================
# SettingsService.get
# ============================================================

def test_settings_get_returns_existing_settings():
    fake_settings = MagicMock()

    fake_db = MagicMock()
    fake_db.query.return_value.first.return_value = fake_settings

    result = SettingsService.get(fake_db)

    assert result == fake_settings
    fake_db.add.assert_not_called()


def test_settings_get_creates_default_when_none_exist():
    fake_db = MagicMock()
    fake_db.query.return_value.first.return_value = None

    result = SettingsService.get(fake_db)

    fake_db.add.assert_called_once()
    fake_db.commit.assert_called_once()
    fake_db.refresh.assert_called_once()
    assert result is not None


# ============================================================
# SettingsService.get_as_dict
# ============================================================

def test_settings_get_as_dict_returns_expected_shape():
    fake_settings = MagicMock()
    fake_settings.id = 1
    fake_settings.platform_name = "SOC Platform"
    fake_settings.incident_severity_threshold = "low,medium,high"
    fake_settings.notifications_enabled = True
    fake_settings.log_retention_days = 30
    fake_settings.updated_at = "2026-08-16T10:00:00"

    fake_db = MagicMock()
    fake_db.query.return_value.first.return_value = fake_settings

    result = SettingsService.get_as_dict(fake_db)

    assert result["platform_name"] == "SOC Platform"
    assert result["incident_severity_threshold"] == ["low", "medium", "high"]
    assert result["notifications_enabled"] is True


# ============================================================
# SettingsService.update
# ============================================================

def test_settings_update_changes_provided_fields():
    fake_settings = MagicMock()

    fake_db = MagicMock()
    fake_db.query.return_value.first.return_value = fake_settings

    result = SettingsService.update(
        fake_db,
        {
            "platform_name": "New Platform Name",
            "incident_severity_threshold": ["high", "critical"],
            "notifications_enabled": False,
            "log_retention_days": 60,
        },
    )

    assert result.platform_name == "New Platform Name"
    assert result.incident_severity_threshold == "high,critical"
    assert result.notifications_enabled is False
    assert result.log_retention_days == 60

    fake_db.commit.assert_called_once()


def test_settings_update_ignores_none_values():
    fake_settings = MagicMock()
    fake_settings.platform_name = "Unchanged Name"

    fake_db = MagicMock()
    fake_db.query.return_value.first.return_value = fake_settings

    result = SettingsService.update(
        fake_db,
        {
            "platform_name": None,
        },
    )

    assert result.platform_name == "Unchanged Name"


# ============================================================
# SettingsService.is_severity_allowed
# ============================================================

def test_is_severity_allowed_true_for_allowed_severity():
    fake_settings = MagicMock()
    fake_settings.incident_severity_threshold = "low, medium, high"

    fake_db = MagicMock()
    fake_db.query.return_value.first.return_value = fake_settings

    assert SettingsService.is_severity_allowed(fake_db, "Medium") is True


def test_is_severity_allowed_false_for_disallowed_severity():
    fake_settings = MagicMock()
    fake_settings.incident_severity_threshold = "low, medium"

    fake_db = MagicMock()
    fake_db.query.return_value.first.return_value = fake_settings

    assert SettingsService.is_severity_allowed(fake_db, "critical") is False


# ============================================================
# SettingsService.purge_old_logs
# ============================================================

def test_purge_old_logs_deletes_and_commits():
    fake_settings = MagicMock()
    fake_settings.log_retention_days = 30

    fake_db = MagicMock()

    settings_query = MagicMock()
    logs_query = MagicMock()

    fake_db.query.side_effect = [settings_query, logs_query]

    settings_query.first.return_value = fake_settings

    fake_column = MagicMock()
    fake_column.__lt__.return_value = MagicMock()

    logs_query.filter.return_value.delete.return_value = 5

    with patch("app.services.settings_service.RawLog.created_at", fake_column):
        result = SettingsService.purge_old_logs(fake_db)

    assert result == 5
    fake_db.commit.assert_called_once()


# ============================================================
# ReportService.get_reports
# ============================================================

def test_get_reports_returns_paginated_result():
    fake_reports = [MagicMock(), MagicMock()]

    fake_query = MagicMock()
    fake_query.count.return_value = 2
    fake_query.filter.return_value = fake_query
    fake_query.order_by.return_value = fake_query
    fake_query.offset.return_value = fake_query
    fake_query.limit.return_value = fake_query
    fake_query.all.return_value = fake_reports

    fake_db = MagicMock()
    fake_db.query.return_value = fake_query

    result = ReportService.get_reports(fake_db, page=1, limit=10)

    assert result["data"] == fake_reports
    assert result["total"] == 2
    assert result["page"] == 1
    assert result["limit"] == 10


def test_get_reports_applies_type_and_risk_filters():
    fake_query = MagicMock()
    fake_query.count.return_value = 0
    fake_query.filter.return_value = fake_query
    fake_query.order_by.return_value = fake_query
    fake_query.offset.return_value = fake_query
    fake_query.limit.return_value = fake_query
    fake_query.all.return_value = []

    fake_db = MagicMock()
    fake_db.query.return_value = fake_query

    ReportService.get_reports(
        fake_db,
        report_type="phishing",
        risk_level="high",
    )

    assert fake_query.filter.call_count == 2


# ============================================================
# ReportService.get_report
# ============================================================

def test_get_report_returns_report():
    fake_report = MagicMock()

    fake_db = MagicMock()
    fake_db.query.return_value.filter.return_value.first.return_value = fake_report

    result = ReportService.get_report(fake_db, 1)

    assert result == fake_report


# ============================================================
# ReportService.delete_report
# ============================================================

def test_delete_report_success():
    fake_report = MagicMock()

    fake_db = MagicMock()
    fake_db.query.return_value.filter.return_value.first.return_value = fake_report

    result = ReportService.delete_report(fake_db, 1)

    fake_db.delete.assert_called_once_with(fake_report)
    fake_db.commit.assert_called_once()
    assert result == fake_report


def test_delete_report_returns_none_when_not_found():
    fake_db = MagicMock()
    fake_db.query.return_value.filter.return_value.first.return_value = None

    result = ReportService.delete_report(fake_db, 999)

    assert result is None
    fake_db.delete.assert_not_called()