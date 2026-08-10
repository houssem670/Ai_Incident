from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.statistics_service import StatisticsService

router = APIRouter(
    prefix="/api/statistics",
    tags=["Statistics"]
)


@router.get("/")
def statistics(db: Session = Depends(get_db)):

    return StatisticsService.get_statistics(db)