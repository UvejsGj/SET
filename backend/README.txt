Backend archive and local data
================================

All backend source and configuration you need for later is under:

  archive/backend/

If you still see set_backend.db in this folder, something on your machine
has the file open (editor, SQLite tool, or a Python process). To stop
services and finish moving the database into the archive without deleting it:

  1) Close database viewers / stop running the API.
  2) From the repo root, run:

       archive\tools\scripts\stop-backend-services.bat

     or in PowerShell:

       .\archive\tools\scripts\stop-backend-services.ps1

Nothing in this repo is intentionally deleted by that script: it stops
listeners on port 8000, stops SET-related uvicorn/python workers, then
moves set_backend.db into archive\backend\ when the file is free.
