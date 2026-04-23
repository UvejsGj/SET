from datetime import datetime, timedelta

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models import AnalyticsEvent, Lead


def build_summary(db: Session, days: int = 14) -> dict:
    since = datetime.utcnow() - timedelta(days=days)
    total_events = db.query(func.count(AnalyticsEvent.id)).scalar() or 0
    total_contacts = db.query(func.count(Lead.id)).filter(Lead.created_at >= since).scalar() or 0

    top_events_rows = (
        db.query(AnalyticsEvent.event_name, func.count(AnalyticsEvent.id).label("count"))
        .filter(AnalyticsEvent.created_at >= since)
        .group_by(AnalyticsEvent.event_name)
        .order_by(func.count(AnalyticsEvent.id).desc())
        .limit(8)
        .all()
    )
    top_sections_rows = (
        db.query(AnalyticsEvent.section, func.count(AnalyticsEvent.id).label("count"))
        .filter(AnalyticsEvent.created_at >= since, AnalyticsEvent.section.is_not(None))
        .group_by(AnalyticsEvent.section)
        .order_by(func.count(AnalyticsEvent.id).desc())
        .limit(8)
        .all()
    )
    daily_rows = (
        db.query(func.date(AnalyticsEvent.created_at).label("day"), func.count(AnalyticsEvent.id).label("count"))
        .filter(AnalyticsEvent.created_at >= since)
        .group_by(func.date(AnalyticsEvent.created_at))
        .order_by(func.date(AnalyticsEvent.created_at))
        .all()
    )

    return {
        "total_events": int(total_events),
        "total_contacts": int(total_contacts),
        "top_events": [{"event_name": row[0], "count": int(row[1])} for row in top_events_rows],
        "top_sections": [{"section": row[0], "count": int(row[1])} for row in top_sections_rows],
        "daily_events": [{"day": str(row[0]), "count": int(row[1])} for row in daily_rows],
    }
