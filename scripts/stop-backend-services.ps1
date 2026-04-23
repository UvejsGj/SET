# Stop SET-related backend services and move any remaining SQLite DB into archive/backend.
# Run from PowerShell, or double-click stop-backend-services.bat (repo root).
$ErrorActionPreference = "Continue"
# PSScriptRoot = ...\SET\scripts  ->  repo root = SET
$root = Split-Path $PSScriptRoot -Parent

Write-Host "Repo root: $root"

# 1) Anything listening on 8000 (typical uvicorn port)
Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue | Where-Object { $_.State -eq "Listen" } | ForEach-Object {
    $procId = $_.OwningProcess
    if (-not (Get-Process -Id $procId -ErrorAction SilentlyContinue)) { return }
    try {
        Write-Host "Stopping PID $procId (listening on :8000)"
        Stop-Process -Id $procId -Force
    } catch {
        Write-Host "Could not stop PID ${procId}: $_"
    }
}

Start-Sleep -Seconds 1

# 2) Python workers that look like this repo's API
Get-CimInstance Win32_Process -Filter "Name = 'python.exe'" -ErrorAction SilentlyContinue | ForEach-Object {
    $cmd = $_.CommandLine
    if ($null -eq $cmd) { return }
    if ($cmd -match "GitHub[\\/]SET" -and ($cmd -match "uvicorn|app\.main:app|archive[\\/]backend|[\\/]backend")) {
        try {
            Write-Host "Stopping PID $($_.ProcessId) (SET backend / uvicorn)"
            Stop-Process -Id $_.ProcessId -Force
        } catch {
            Write-Host "Could not stop PID $($_.ProcessId): $_"
        }
    }
}

Start-Sleep -Seconds 1

# 3) Move local DB from legacy root backend/ into archive (keep, do not delete from disk until move succeeds)
$srcDb = Join-Path $root "backend\set_backend.db"
$destDir = Join-Path $root "archive\backend"
$destDb = Join-Path $destDir "set_backend.db"

if (Test-Path $srcDb) {
    if (-not (Test-Path $destDir)) {
        New-Item -ItemType Directory -Path $destDir -Force | Out-Null
    }
    if (Test-Path $destDb) {
        Write-Host "archive\backend\set_backend.db already exists; leaving root copy in place if move fails."
    }
    try {
        Move-Item -LiteralPath $srcDb -Destination $destDb -Force -ErrorAction Stop
        Write-Host "Moved set_backend.db -> archive\backend\set_backend.db"
    } catch {
        Write-Host "Could not move set_backend.db (file may be open in Cursor, a DB browser, or another process)."
        Write-Host "Close those tools and run this script again. Nothing was deleted."
    }
}

# 4) Remove empty root backend/ folder only if it is empty (never delete non-empty except via move above)
$legacyBackend = Join-Path $root "backend"
if (Test-Path $legacyBackend) {
    $items = Get-ChildItem -LiteralPath $legacyBackend -Force -ErrorAction SilentlyContinue
    if ($null -eq $items -or $items.Count -eq 0) {
        Remove-Item -LiteralPath $legacyBackend -Force -Recurse -ErrorAction SilentlyContinue
        Write-Host "Removed empty backend\ folder."
    } elseif ($items | Where-Object { $_.Name -eq "README.txt" }) {
        Write-Host "backend\ still has files (e.g. README.txt or a locked set_backend.db). See backend\README.txt"
    }
}

Write-Host "Done."
