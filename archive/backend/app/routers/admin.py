from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import require_admin
from app.models import Lead, User
from app.schemas import LeadResponse, LeadStatusUpdate

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.get("/leads", response_model=list[LeadResponse])
def list_leads(
    status_filter: str | None = None,
    limit: int = 100,
    _: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    limit = max(1, min(limit, 500))
    query = db.query(Lead).order_by(Lead.created_at.desc())
    if status_filter:
        query = query.filter(Lead.status == status_filter)
    return query.limit(limit).all()


@router.patch("/leads/{lead_id}", response_model=LeadResponse)
def update_lead_status(
    lead_id: int,
    payload: LeadStatusUpdate,
    _: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lead not found")
    lead.status = payload.status
    db.commit()
    db.refresh(lead)
    return lead
