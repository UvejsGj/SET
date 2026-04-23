#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo "Static site: serving repo root on http://127.0.0.1:5500 ..."
echo "Open: Website/Pages/Homepage/homepage.html"
echo "Shelved backend (optional): archive/backend"
cd "$ROOT_DIR"
python -m http.server 5500
