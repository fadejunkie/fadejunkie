# Install Lobe Design Cron — Windows Task Scheduler
# Run this once from PowerShell (Admin) to register the 30-min task
#
# Usage:  powershell -ExecutionPolicy Bypass -File lobe/cron/install-cron.ps1
# Remove: schtasks /Delete /TN "FadeJunkie-Lobe-DesignCron" /F

$taskName  = "FadeJunkie-Lobe-DesignCron"
$nodeExe   = (Get-Command node).Source
$scriptPath = "C:\Users\twani\fadejunkie\lobe\cron\runner.mjs"
$workDir   = "C:\Users\twani\fadejunkie"
$logPath   = "C:\Users\twani\fadejunkie\lobe\cron\cron.log"

# Remove existing task if present
schtasks /Delete /TN $taskName /F 2>$null

# Create scheduled task — every 30 minutes, indefinitely
$action = New-ScheduledTaskAction `
  -Execute $nodeExe `
  -Argument $scriptPath `
  -WorkingDirectory $workDir

$trigger = New-ScheduledTaskTrigger `
  -Once `
  -At (Get-Date).Date `
  -RepetitionInterval (New-TimeSpan -Minutes 30) `
  -RepetitionDuration ([TimeSpan]::MaxValue)

$settings = New-ScheduledTaskSettingsSet `
  -AllowStartIfOnBatteries `
  -DontStopIfGoingOnBatteries `
  -StartWhenAvailable `
  -ExecutionTimeLimit (New-TimeSpan -Minutes 25) `
  -MultipleInstances IgnoreNew

$principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType Interactive

Register-ScheduledTask `
  -TaskName $taskName `
  -Action $action `
  -Trigger $trigger `
  -Settings $settings `
  -Principal $principal `
  -Description "Lobe design system cron — pushes design rules to all fadejunkie pages every 30 min"

Write-Host ""
Write-Host "Registered: $taskName" -ForegroundColor Green
Write-Host "Schedule:   Every 30 minutes" -ForegroundColor Cyan
Write-Host "Script:     $scriptPath" -ForegroundColor Cyan
Write-Host "Logs:       $logPath" -ForegroundColor Cyan
Write-Host ""
Write-Host "To remove:  schtasks /Delete /TN '$taskName' /F" -ForegroundColor Yellow
Write-Host "To test:    node $scriptPath" -ForegroundColor Yellow
