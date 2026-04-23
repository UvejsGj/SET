from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import require_admin
from app.models import ContentBlock, User
from app.schemas import ContentBlockIn

router = APIRouter(prefix="/api/content", tags=["content"])


@router.get("/homepage")
def get_homepage_content(locale: str = "en", db: Session = Depends(get_db)):
    rows = (
        db.query(ContentBlock)
        .filter(ContentBlock.locale == locale, ContentBlock.is_latest.is_(True))
        .order_by(ContentBlock.key.asc())
        .all()
    )
    return {"locale": locale, "blocks": {row.key: row.value for row in rows}}


@router.get("/homepage/history")
def get_homepage_content_history(
    locale: str = "en",
    key: str | None = None,
    _: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    query = db.query(ContentBlock).filter(ContentBlock.locale == locale)
    if key:
        query = query.filter(ContentBlock.key == key)
    rows = query.order_by(ContentBlock.created_at.desc()).limit(100).all()
    return {"items": rows}


@router.put("/homepage/block")
def upsert_homepage_block(
    payload: ContentBlockIn,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    current = (
        db.query(ContentBlock)
        .filter(
            ContentBlock.locale == payload.locale,
            ContentBlock.key == payload.key,
            ContentBlock.is_latest.is_(True),
        )
        .first()
    )
    next_version = 1
    if current:
        current.is_latest = False
        next_version = current.version + 1
    block = ContentBlock(
        locale=payload.locale,
        key=payload.key,
        value=payload.value,
        version=next_version,
        is_latest=True,
        updated_by=admin.email,
    )
    db.add(block)
    db.commit()
    db.refresh(block)
    return block
