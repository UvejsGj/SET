#!/usr/bin/env bash
echo "Backend is shelved under archive/backend. This script is disabled for static-only mode."
echo "To run the API later: cd archive/backend, venv + pip install -r requirements.txt, then uvicorn app.main:app --reload --port 8000"
exit 0
