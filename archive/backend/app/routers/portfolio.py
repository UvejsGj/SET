from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.deps import require_admin
from app.models import PortfolioMedia, PortfolioProject, User
from app.schemas import PortfolioMediaIn, PortfolioProjectIn, PortfolioProjectOut

router = APIRouter(prefix="/api/portfolio", tags=["portfolio"])


@router.get("/projects", response_model=list[PortfolioProjectOut])
def get_projects(locale: str | None = None, db: Session = Depends(get_db)):
    query = db.query(PortfolioProject).options(joinedload(PortfolioProject.media))
    query = query.filter(PortfolioProject.is_published.is_(True))
    if locale:
        query = query.filter(PortfolioProject.locale == locale)
    projects = query.order_by(PortfolioProject.sort_order.asc(), PortfolioProject.id.asc()).all()
    return projects


@router.get("/projects/{slug}", response_model=PortfolioProjectOut)
def get_project(slug: str, db: Session = Depends(get_db)):
    project = (
        db.query(PortfolioProject)
        .options(joinedload(PortfolioProject.media))
        .filter(PortfolioProject.slug == slug, PortfolioProject.is_published.is_(True))
        .first()
    )
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    return project


@router.post("/admin/projects", response_model=PortfolioProjectOut)
def create_project(payload: PortfolioProjectIn, _: User = Depends(require_admin), db: Session = Depends(get_db)):
    exists = db.query(PortfolioProject).filter(PortfolioProject.slug == payload.slug).first()
    if exists:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Slug already exists")
    project = PortfolioProject(
        slug=payload.slug,
        title=payload.title,
        summary=payload.summary,
        locale=payload.locale,
        is_published=payload.is_published,
        sort_order=payload.sort_order,
    )
    db.add(project)
    db.flush()
    for media_item in payload.media:
        db.add(
            PortfolioMedia(
                project_id=project.id,
                image_url=media_item.image_url,
                alt_text=media_item.alt_text,
                title=media_item.title,
                sort_order=media_item.sort_order,
            )
        )
    db.commit()
    db.refresh(project)
    return (
        db.query(PortfolioProject)
        .options(joinedload(PortfolioProject.media))
        .filter(PortfolioProject.id == project.id)
        .first()
    )


@router.put("/admin/projects/{project_id}", response_model=PortfolioProjectOut)
def update_project(
    project_id: int,
    payload: PortfolioProjectIn,
    _: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    project = db.query(PortfolioProject).filter(PortfolioProject.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    project.slug = payload.slug
    project.title = payload.title
    project.summary = payload.summary
    project.locale = payload.locale
    project.is_published = payload.is_published
    project.sort_order = payload.sort_order

    db.query(PortfolioMedia).filter(PortfolioMedia.project_id == project.id).delete()
    for media_item in payload.media:
        db.add(
            PortfolioMedia(
                project_id=project.id,
                image_url=media_item.image_url,
                alt_text=media_item.alt_text,
                title=media_item.title,
                sort_order=media_item.sort_order,
            )
        )
    db.commit()
    return (
        db.query(PortfolioProject)
        .options(joinedload(PortfolioProject.media))
        .filter(PortfolioProject.id == project.id)
        .first()
    )


@router.delete("/admin/projects/{project_id}")
def delete_project(project_id: int, _: User = Depends(require_admin), db: Session = Depends(get_db)):
    project = db.query(PortfolioProject).filter(PortfolioProject.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    db.delete(project)
    db.commit()
    return {"ok": True}


@router.post("/admin/projects/{project_id}/media", response_model=PortfolioProjectOut)
def add_project_media(
    project_id: int,
    payload: PortfolioMediaIn,
    _: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    project = db.query(PortfolioProject).filter(PortfolioProject.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    db.add(
        PortfolioMedia(
            project_id=project.id,
            image_url=payload.image_url,
            alt_text=payload.alt_text,
            title=payload.title,
            sort_order=payload.sort_order,
        )
    )
    db.commit()
    return (
        db.query(PortfolioProject)
        .options(joinedload(PortfolioProject.media))
        .filter(PortfolioProject.id == project.id)
        .first()
    )
