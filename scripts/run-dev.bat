@echo off
setlocal

pushd "%~dp0.."
set "ROOT_DIR=%CD%"
popd

echo Static site: serving repo root on http://127.0.0.1:5500 ...
echo Open: Website\Pages\Homepage\homepage.html
echo Shelved backend (optional): archive\backend
cd /d "%ROOT_DIR%"
python -m http.server 5500
