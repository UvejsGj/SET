from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import require_admin
from app.models import AnalyticsEvent, User
from app.schemas import AnalyticsEventIn, AnalyticsSummaryOut
from app.services.analytics import build_summary

router = APIRouter(prefix="/api/analytics", tags=["analytics"])


@router.post("/events")
def ingest_event(payload: AnalyticsEventIn, request: Request, db: Session = Depends(get_db)):
    client_ip = request.headers.get("x-forwarded-for", request.client.host if request.client else "unknown")
    event = AnalyticsEvent(
        event_name=payload.event_name,
        route=payload.route,
        section=payload.section,
        locale=payload.locale,
        event_metadata=payload.metadata,
        ip_address=client_ip,
    )
    db.add(event)
    db.commit()
    return {"ok": True}


@router.get("/summary", response_model=AnalyticsSummaryOut)
def get_summary(days: int = 14, _: User = Depends(require_admin), db: Session = Depends(get_db)):
    days = max(1, min(days, 90))
    data = build_summary(db, days=days)
    return data
