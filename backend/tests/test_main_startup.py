import importlib
from unittest.mock import patch

from sqlalchemy.exc import OperationalError


def test_table_creation_race_condition_is_ignored():
    """
    If Base.metadata.create_all() raises because another worker
    already created the tables (multi-worker race condition),
    app.main must not crash — it should swallow the error.
    """
    with patch(
        "app.database.Base.metadata.create_all",
        side_effect=OperationalError("stmt", "params", "orig"),
    ):
        import app.main
        importlib.reload(app.main)  # re-run the module-level try/except

    # Reload again normally so the rest of the test suite isn't affected
    import app.main
    importlib.reload(app.main)