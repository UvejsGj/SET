from collections import deque
from datetime import datetime, timezone

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Lead
from app.schemas import ContactRequest
from app.services.email import send_lead_notification

router = APIRouter(prefix="/api/contact", tags=["contact"])

MAX_PER_IP_PER_MINUTE = 5
MAX_RATE_TRACKED_KEYS = 50_000
ip_buckets: dict[str, deque[datetime]] = {}


def client_ip_for_rate_limit(request: Request) -> str:
    """Stable client key for throttling. Uses the left-most X-Forwarded-For hop when present.

    X-Forwarded-For is only trustworthy when set by your edge proxy; otherwise clients can
    spoof the first hop. Prefer terminating TLS at a proxy that appends this header.
    """
    xff = request.headers.get("x-forwarded-for")
    if xff:
        first = xff.split(",")[0].strip()
        if first and len(first) <= 64 and "\r" not in first and "\n" not in first:
            return first[:64]
    if request.client:
        return request.client.host
    return "unknown"


def check_rate_limit(ip: str) -> None:
    now = datetime.now(timezone.utc)
    bucket = ip_buckets.get(ip)
    if bucket is not None:
        while bucket and (now - bucket[0]).total_seconds() > 60:
            bucket.popleft()
        if not bucket:
            ip_buckets.pop(ip, None)
            bucket = None

    if bucket is None:
        while len(ip_buckets) >= MAX_RATE_TRACKED_KEYS:
            ip_buckets.pop(next(iter(ip_buckets)))
        bucket = deque()
        ip_buckets[ip] = bucket

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

    client_ip = client_ip_for_rate_limit(request)
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
