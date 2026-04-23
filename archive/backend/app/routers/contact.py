from collections import defaultdict, deque
from datetime import datetime

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Lead
from app.schemas import ContactRequest
from app.services.email import send_lead_notification

router = APIRouter(prefix="/api/contact", tags=["contact"])

MAX_PER_IP_PER_MINUTE = 5
ip_buckets: dict[str, deque[datetime]] = defaultdict(deque)


def check_rate_limit(ip: str) -> None:
    now = datetime.utcnow()
    bucket = ip_buckets[ip]
    while bucket and (now - bucket[0]).total_seconds() > 60:
        bucket.popleft()
    if len(bucket) >= MAX_PER_IP_PER_MINUTE:
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Too many requests")
    bucket.append(now)


@router.post("")
def create_lead(
    payload: ContactRequest,
    request: Request,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    if payload.honeypot.strip():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Spam detected")

    client_ip = request.headers.get("x-forwarded-for", request.client.host if request.client else "unknown")
    check_rate_limit(client_ip)

    lead = Lead(
        name=payload.name.strip(),
        email=str(payload.email).lower(),
        subject=payload.subject.strip(),
        message=payload.message.strip(),
        locale=payload.locale.strip() or "en",
        source=payload.source.strip() or "homepage",
        ip_address=client_ip,
    )
    db.add(lead)
    db.commit()
    db.refresh(lead)
    background_tasks.add_task(send_lead_notification, lead)
    return {"ok": True, "id": lead.id, "message": "Lead captured"}
