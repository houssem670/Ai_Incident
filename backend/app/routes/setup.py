from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.database import get_db
from app.services.user_service import UserService
from app.schemas.user import FirstAdminCreate

router = APIRouter(
    prefix="/api/setup",
    tags=["Setup"],
)


@router.get("/status")
def setup_status(db: Session = Depends(get_db)):
    """
    Vérifie si un administrateur existe déjà.
    """

    return {
        "admin_exists": UserService.admin_exists(db)
    }

@router.post("/create-admin")
def create_admin(
    payload: FirstAdminCreate,
    db: Session = Depends(get_db),
):

    admin = UserService.create_first_admin(
        db=db,
        username=payload.username,
        email=payload.email,
        password=payload.password,
    )

    return {
        "message": "Administrator created successfully.",
        "username": admin.username,
    }