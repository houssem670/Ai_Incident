from unittest.mock import MagicMock

import pytest

from app.services.user_service import UserService


# ============================================================
# admin_exists
# ============================================================

def test_admin_exists_returns_true_when_admin_present():
    fake_db = MagicMock()
    fake_db.query.return_value.filter.return_value.first.return_value = MagicMock()

    assert UserService.admin_exists(fake_db) is True


def test_admin_exists_returns_false_when_no_admin():
    fake_db = MagicMock()
    fake_db.query.return_value.filter.return_value.first.return_value = None

    assert UserService.admin_exists(fake_db) is False


# ============================================================
# create_first_admin
# ============================================================

def test_create_first_admin_success():
    fake_db = MagicMock()
    fake_db.query.return_value.filter.return_value.first.return_value = None

    admin = UserService.create_first_admin(
        fake_db, username="root", email="root@example.com", password="secret123"
    )

    fake_db.add.assert_called_once()
    fake_db.commit.assert_called_once()
    fake_db.refresh.assert_called_once()
    assert admin.username == "root"
    assert admin.role == "admin"
    assert admin.is_superuser is True


def test_create_first_admin_raises_if_admin_already_exists():
    fake_db = MagicMock()
    fake_db.query.return_value.filter.return_value.first.return_value = MagicMock()

    with pytest.raises(ValueError, match="Administrator already exists."):
        UserService.create_first_admin(
            fake_db, username="root", email="root@example.com", password="secret123"
        )


# ============================================================
# list_users / get_user_by_id
# ============================================================

def test_list_users_returns_ordered_query_result():
    fake_users = [MagicMock(), MagicMock()]
    fake_db = MagicMock()
    fake_db.query.return_value.order_by.return_value.all.return_value = fake_users

    result = UserService.list_users(fake_db)

    assert result == fake_users


def test_get_user_by_id_returns_user():
    fake_user = MagicMock()
    fake_db = MagicMock()
    fake_db.query.return_value.filter.return_value.first.return_value = fake_user

    result = UserService.get_user_by_id(fake_db, user_id=1)

    assert result == fake_user


# ============================================================
# create_user
# ============================================================

def test_create_user_success():
    fake_db = MagicMock()
    fake_db.query.return_value.filter.return_value.first.return_value = None

    user = UserService.create_user(
        fake_db, username="jdoe", email="jdoe@example.com", password="pass123", role="analyst"
    )

    fake_db.add.assert_called_once()
    fake_db.commit.assert_called_once()
    assert user.role == "analyst"
    assert user.is_superuser is False


def test_create_user_rejects_admin_role():
    fake_db = MagicMock()

    with pytest.raises(ValueError, match="Invalid role"):
        UserService.create_user(
            fake_db, username="jdoe", email="jdoe@example.com", password="pass123", role="admin"
        )


def test_create_user_rejects_unknown_role():
    fake_db = MagicMock()

    with pytest.raises(ValueError, match="Invalid role"):
        UserService.create_user(
            fake_db, username="jdoe", email="jdoe@example.com", password="pass123", role="hacker"
        )


def test_create_user_rejects_duplicate_username_or_email():
    fake_db = MagicMock()
    fake_db.query.return_value.filter.return_value.first.return_value = MagicMock()

    with pytest.raises(ValueError, match="Username or email already in use."):
        UserService.create_user(
            fake_db, username="jdoe", email="jdoe@example.com", password="pass123", role="analyst"
        )


# ============================================================
# update_user
# ============================================================

def test_update_user_success_updates_role_and_status():
    fake_user = MagicMock()
    fake_user.is_superuser = False

    fake_db = MagicMock()
    fake_db.query.return_value.filter.return_value.first.return_value = fake_user

    result = UserService.update_user(fake_db, user_id=1, role="manager", is_active=False)

    assert result.role == "manager"
    assert result.is_active is False
    fake_db.commit.assert_called_once()


def test_update_user_raises_if_not_found():
    fake_db = MagicMock()
    fake_db.query.return_value.filter.return_value.first.return_value = None

    with pytest.raises(ValueError, match="User not found."):
        UserService.update_user(fake_db, user_id=999, role="manager", is_active=None)


def test_update_user_raises_if_target_is_superuser():
    fake_user = MagicMock()
    fake_user.is_superuser = True

    fake_db = MagicMock()
    fake_db.query.return_value.filter.return_value.first.return_value = fake_user

    with pytest.raises(ValueError, match="Cannot modify the administrator account."):
        UserService.update_user(fake_db, user_id=1, role="manager", is_active=None)


def test_update_user_rejects_invalid_role():
    fake_user = MagicMock()
    fake_user.is_superuser = False

    fake_db = MagicMock()
    fake_db.query.return_value.filter.return_value.first.return_value = fake_user

    with pytest.raises(ValueError, match="Invalid role"):
        UserService.update_user(fake_db, user_id=1, role="admin", is_active=None)


# ============================================================
# delete_user
# ============================================================

def test_delete_user_success():
    fake_user = MagicMock()
    fake_user.is_superuser = False

    fake_db = MagicMock()
    fake_db.query.return_value.filter.return_value.first.return_value = fake_user

    UserService.delete_user(fake_db, user_id=1)

    fake_db.delete.assert_called_once_with(fake_user)
    fake_db.commit.assert_called_once()


def test_delete_user_raises_if_not_found():
    fake_db = MagicMock()
    fake_db.query.return_value.filter.return_value.first.return_value = None

    with pytest.raises(ValueError, match="User not found."):
        UserService.delete_user(fake_db, user_id=999)


def test_delete_user_raises_if_target_is_superuser():
    fake_user = MagicMock()
    fake_user.is_superuser = True

    fake_db = MagicMock()
    fake_db.query.return_value.filter.return_value.first.return_value = fake_user

    with pytest.raises(ValueError, match="Cannot delete the administrator account."):
        UserService.delete_user(fake_db, user_id=1)