Archived FastAPI backend (entire former backend tree, without .venv)
=====================================================================

Everything for the API lives under:

  archive/backend/

Included: application code, Alembic migrations, tests, .env.example, and
(when your machine releases the file) the local SQLite database
set_backend.db.

Stop services and finish moving a leftover DB from backend\:
------------------------------------------------------------
From repo root (Windows):

  archive\tools\scripts\stop-backend-services.bat

That script stops processes listening on port 8000 and Python workers
that match this repo and uvicorn, then moves backend\set_backend.db
here if it is not locked. It does not delete your data.

Restore and run later
---------------------
  cd archive/backend
  python -m venv .venv
  .venv\Scripts\activate
  pip install -r requirements.txt
  copy .env.example .env   (then edit secrets and origins)
  uvicorn app.main:app --reload --port 8000

The public website in this branch is static-only; see docs/RUN-INSTRUCTIONS.txt.
