@echo off
REM wcorwin SEO Daily Runner
REM Called by Windows Task Scheduler at 6:00 AM daily.
REM Logs to %USERPROFILE%\logs\wcorwin-seo-daily.log

set LOG=%USERPROFILE%\logs\wcorwin-seo-daily.log
if not exist "%USERPROFILE%\logs" mkdir "%USERPROFILE%\logs"

echo. >> "%LOG%"
echo ========================================= >> "%LOG%"
echo Started: %DATE% %TIME% >> "%LOG%"

node "%~dp0seo-daily-runner.mjs" >> "%LOG%" 2>&1

echo Exited: %DATE% %TIME% >> "%LOG%"
