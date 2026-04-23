# SET Python Backend

FastAPI backend for contact pipeline, portfolio CMS, localized homepage content, uploads, and analytics.

## Quick start

1. Create a virtual environment and install deps:
   - `python -m venv .venv`
   - `.venv\\Scripts\\activate` (Windows bash: `source .venv/Scripts/activate`)
   - `pip install -r requirements.txt`
2. Copy `.env.example` to `.env` and set secrets.
3. Run API:
   - `uvicorn app.main:app --reload --port 8000`
4. Optional migrations:
   - `alembic upgrade head`

## Endpoints

- Auth: `/api/auth/login`, `/api/auth/logout`
- Contact ingest: `POST /api/contact`
- Lead admin: `GET/PATCH /api/admin/leads`
- Portfolio public/admin: `/api/portfolio/*`
- Homepage content public/admin: `/api/content/homepage*`
- Analytics: `POST /api/analytics/events`, `GET /api/analytics/summary`
- Upload signing/put: `/api/uploads/sign`, `/api/uploads/put`

## Notes

- For local development, DB defaults to SQLite.
- For production, set PostgreSQL `DATABASE_URL`.
- CORS is controlled by `ALLOWED_ORIGINS`.
