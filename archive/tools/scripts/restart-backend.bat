@echo off
setlocal
echo Backend is shelved under archive\backend. This script is disabled for static-only mode.
echo To run the API later: create a venv in archive\backend, install requirements, then:
echo   cd archive\backend ^&^& .venv\Scripts\activate ^&^& uvicorn app.main:app --reload --port 8000
exit /b 0
