from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.database import Base, SessionLocal, engine
from app.models import ContentBlock, PortfolioMedia, PortfolioProject, User
from app.routers import admin, analytics, auth, contact, content, portfolio, uploads
from app.security import hash_password

settings = get_settings()


def seed_defaults():
    db = SessionLocal()
    try:
        admin_user = db.query(User).filter(User.email == settings.admin_email.lower()).first()
        if not admin_user:
            db.add(
                User(
                    email=settings.admin_email.lower(),
                    password_hash=hash_password(settings.admin_password),
                    role="admin",
                    is_active=True,
                )
            )

        starter_projects = [
            ("interactive-3d-web-experience", "Interactive 3D Web Experience", "../../Imazhet/Projektet/SE1.png"),
            ("motion-driven-landing-page", "Motion-Driven Landing Page", "../../Imazhet/Projektet/SE2.png"),
            ("product-visualization-platform", "Product Visualization Platform", "../../Imazhet/Projektet/SE3.png"),
            ("industrial-render-set", "Industrial Render Set", "../../Imazhet/Projektet/SE4.png"),
            ("prototype-storyboard", "Prototype Storyboard", "../../Imazhet/Projektet/SE5.png"),
            ("process-animation-flow", "Process Animation Flow", "../../Imazhet/Projektet/SE6.png"),
            ("configuration-showcase", "Configuration Showcase", "../../Imazhet/Projektet/SE7.png"),
            ("assembly-walkthrough", "Assembly Walkthrough", "../../Imazhet/Projektet/SE8.png"),
            ("ui-engineering-concept", "UI + Engineering Concept", "../../Imazhet/Projektet/SE9.png"),
            ("landing-experience-build", "Landing Experience Build", "../../Imazhet/Projektet/SE10.png"),
            ("motion-graphics-sequence", "Motion Graphics Sequence", "../../Imazhet/Projektet/SE11.png"),
            ("product-storytelling-set", "Product Storytelling Set", "../../Imazhet/Projektet/SE12.png"),
        ]
        for idx, (slug, title, image_url) in enumerate(starter_projects):
            exists = db.query(PortfolioProject).filter(PortfolioProject.slug == slug).first()
            if exists:
                continue
            project = PortfolioProject(
                slug=slug,
                title=title,
                summary="Curated client project delivery",
                locale="en",
                is_published=True,
                sort_order=idx,
            )
            db.add(project)
            db.flush()
            db.add(
                PortfolioMedia(
                    project_id=project.id,
                    image_url=image_url,
                    alt_text=title,
                    title=title,
                    sort_order=0,
                )
            )

        if not db.query(ContentBlock).filter(ContentBlock.locale == "en", ContentBlock.key == "homepage").first():
            db.add(
                ContentBlock(
                    locale="en",
                    key="homepage",
                    value={
                        "heroTitle": "Build Smarter Products with Smart Engineering",
                        "heroTagline": "From concept to launch-ready delivery.",
                        "servicesIntro": "Engineering, design, and product storytelling services tailored to move work from idea to execution.",
                    },
                    version=1,
                    is_latest=True,
                    updated_by="system",
                )
            )
        db.commit()
    finally:
        db.close()


@asynccontextmanager
async def lifespan(_: FastAPI):
    Base.metadata.create_all(bind=engine)
    seed_defaults()
    yield


app = FastAPI(title=settings.app_name, version="1.0.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_origin_regex=settings.cors_origin_regex,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(contact.router)
app.include_router(admin.router)
app.include_router(portfolio.router)
app.include_router(content.router)
app.include_router(analytics.router)
app.include_router(uploads.router)


@app.get("/api/health")
def health():
    return {"ok": True, "service": settings.app_name, "environment": settings.environment}
