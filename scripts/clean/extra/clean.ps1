#!/usr/bin/env pwsh
# filepath: scripts/clean/extra/clean.ps1
# PowerShell clean script for GDG PUP Platform

$ErrorActionPreference = "Stop"

Write-Host "=== Stopping Turbo daemon ===" -ForegroundColor Yellow
try {
    turbo daemon stop
} catch {
    Write-Host "Turbo daemon already stopped" -ForegroundColor Cyan
}

Write-Host "=== Cleaning build artifacts ===" -ForegroundColor Yellow
npx rimraf "**/dist" "dist"

Write-Host "=== Cleaning cache files ===" -ForegroundColor Yellow
npx rimraf ".turbo" "**/.turbo" ".next" "**/.next" ".vite" "**/.vite" "node_modules/.cache" "**/node_modules/.cache" "node_modules/.vite" "**/node_modules/.vite"

Write-Host "=== Cleaning log files ===" -ForegroundColor Yellow
npx rimraf "*.log" "**/*.log" "logs" "**/logs"

Write-Host "=== Cleaning lock files ===" -ForegroundColor Yellow
npx rimraf "pnpm-lock.yaml" "**/pnpm-lock.yaml"

Write-Host "✨ Clean complete! Run pnpm install to reinstall dependencies." -ForegroundColor Green