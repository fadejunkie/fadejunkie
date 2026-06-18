@echo off
REM wcorwin SEO Push Audit — pushes outbox results to Convex
REM Called by Windows Task Scheduler at 10:00 AM daily.

set LOG=%USERPROFILE%\logs\wcorwin-seo-push.log
if not exist "%USERPROFILE%\logs" mkdir "%USERPROFILE%\logs"

echo. >> "%LOG%"
echo ========================================= >> "%LOG%"
echo Started: %DATE% %TIME% >> "%LOG%"

node "%~dp0seo-push-audit.mjs" >> "%LOG%" 2>&1

echo Exited: %DATE% %TIME% >> "%LOG%"
