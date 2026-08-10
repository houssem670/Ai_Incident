from sqlalchemy.orm import Session

from app.models.user import User
from app.security.password import hash_password


VALID_ROLES = {"admin", "analyst", "manager"}


class UserService:

    @staticmethod
    def admin_exists(db: Session) -> bool:
        return (
            db.query(User)
            .filter(User.is_superuser == True)
            .first()
            is not None
        )

    @staticmethod
    def create_first_admin(
        db: Session,
        username: str,
        email: str,
        password: str,
    ):
        if UserService.admin_exists(db):
            raise ValueError("Administrator already exists.")

        admin = User(
            username=username,
            email=email,
            password_hash=hash_password(password),
            role="admin",
            is_active=True,
            is_superuser=True,
        )

        db.add(admin)
        db.commit()
        db.refresh(admin)

        return admin

    @staticmethod
    def list_users(db: Session):
        return db.query(User).order_by(User.id.asc()).all()

    @staticmethod
    def get_user_by_id(db: Session, user_id: int):
        return db.query(User).filter(User.id == user_id).first()

    @staticmethod
    def create_user(
        db: Session,
        username: str,
        email: str,
        password: str,
        role: str,
    ):
        if role not in VALID_ROLES or role == "admin":
            raise ValueError("Invalid role. Must be 'analyst' or 'manager'.")

        existing = (
            db.query(User)
            .filter((User.username == username) | (User.email == email))
            .first()
        )
        if existing:
            raise ValueError("Username or email already in use.")

        user = User(
            username=username,
            email=email,
            password_hash=hash_password(password),
            role=role,
            is_active=True,
            is_superuser=False,
        )

        db.add(user)
        db.commit()
        db.refresh(user)

        return user

    @staticmethod
    def update_user(db: Session, user_id: int, role: str | None, is_active: bool | None):
        user = UserService.get_user_by_id(db, user_id)
        if not user:
            raise ValueError("User not found.")

        if user.is_superuser:
            raise ValueError("Cannot modify the administrator account.")

        if role is not None:
            if role not in VALID_ROLES or role == "admin":
                raise ValueError("Invalid role. Must be 'analyst' or 'manager'.")
            user.role = role

        if is_active is not None:
            user.is_active = is_active

        db.commit()
        db.refresh(user)

        return user

    @staticmethod
    def delete_user(db: Session, user_id: int):
        user = UserService.get_user_by_id(db, user_id)
        if not user:
            raise ValueError("User not found.")

        if user.is_superuser:
            raise ValueError("Cannot delete the administrator account.")

        db.delete(user)
        db.commit()